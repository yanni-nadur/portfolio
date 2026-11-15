import { useEffect, useMemo } from "react";
import {
    additionalProjectArray,
    featuredProjectArray,
    findAnyProject,
    findFeaturedProject,
    getAssetUrl
} from "../../content";
import type { AdditionalProject, FeaturedProject } from "../../content/types";
import { ProjectMedia } from "../../components/ProjectMedia";
import { useI18n } from "../../i18n/I18nProvider";
import { useSettings } from "../../store/settingsStore";
import { useWindows } from "../../system/windowStore";

// -- TYPES
type LibraryTab = "library" | "favorites";

// -- OPERATIONS
export default function PhotosApp()
{
    const { t, localize } = useI18n();
    const { isProjectFavorite, toggleFavoriteProject, favoriteProjectIdArray } = useSettings();
    const { windowByIdMap, setAppRoute } = useWindows();
    const route = windowByIdMap.photos.route;

    const selectedProjectId = useMemo(() =>
    {
        if (!route)
        {
            return null;
        }

        if (route === "favorites")
        {
            return null;
        }

        return route;
    }, [route]);

    const activeTab: LibraryTab = route === "favorites" ? "favorites" : "library";
    const selectedFeatured = selectedProjectId ? findFeaturedProject(selectedProjectId) : null;
    const selectedAny = selectedProjectId ? findAnyProject(selectedProjectId) : null;

    useEffect(() =>
    {
        if (!selectedProjectId)
        {
            return;
        }

        const activeProjectId = selectedProjectId;

        function handleKeyDown(event: KeyboardEvent)
        {
            if (event.key === "Escape")
            {
                setAppRoute("photos", null);
            }

            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
            {
                return;
            }

            const projectIdArray = featuredProjectArray.map((project) => project.id);
            const currentIndex = projectIdArray.indexOf(activeProjectId);

            if (currentIndex < 0)
            {
                return;
            }

            const delta = event.key === "ArrowRight" ? 1 : -1;
            const nextIndex = (currentIndex + delta + projectIdArray.length) % projectIdArray.length;
            setAppRoute("photos", projectIdArray[nextIndex]);
        }

        window.addEventListener("keydown", handleKeyDown);

        return () =>
        {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedProjectId, setAppRoute]);

    if (selectedFeatured)
    {
        return (
            <CaseStudyView
                project={selectedFeatured}
                isFavorite={isProjectFavorite(selectedFeatured.id)}
                onBack={() => setAppRoute("photos", null)}
                onToggleFavorite={() => toggleFavoriteProject(selectedFeatured.id)}
            />
        );
    }

    if (selectedAny && !("featured" in selectedAny && selectedAny.featured))
    {
        const project = selectedAny as AdditionalProject;
        const localized = localize(project);

        return (
            <div className="space-y-4 p-5">
                <button
                    type="button"
                    className="text-sm font-semibold text-accent"
                    onClick={() => setAppRoute("photos", null)}
                >
                    {t("back")}
                </button>
                <div
                    className="overflow-hidden rounded-2xl"
                    style={{ background: "#1F3A5F" }}
                >
                    {project.image ? (
                        <img
                            src={getAssetUrl(project.image)}
                            alt=""
                            className="h-56 w-full object-cover"
                        />
                    ) : null}
                </div>
                <h3 className="font-display text-2xl font-semibold">{localized.title}</h3>
                <p className="text-sm text-slateSoft dark:text-white/70">{localized.summary}</p>
                {project.hasPublicUrl && project.url ? (
                    <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white"
                    >
                        {t("photosVisit")}
                    </a>
                ) : null}
            </div>
        );
    }

    const favoriteProjectArray = [
        ...featuredProjectArray,
        ...additionalProjectArray
    ].filter((project) => favoriteProjectIdArray.includes(project.id));

    return (
        <div className="space-y-5 p-5">
            <div className="flex gap-2">
                <TabButton
                    label={t("photosLibrary")}
                    isActive={activeTab === "library"}
                    onClick={() => setAppRoute("photos", null)}
                />
                <TabButton
                    label={t("photosFavorites")}
                    isActive={activeTab === "favorites"}
                    onClick={() => setAppRoute("photos", "favorites")}
                />
            </div>

            {activeTab === "favorites" ? (
                favoriteProjectArray.length === 0 ? (
                    <p className="text-sm text-slateSoft dark:text-white/60">
                        {t("photosEmptyFavorites")}
                    </p>
                ) : (
                    <ProjectGrid
                        projectArray={favoriteProjectArray}
                        onOpen={(projectId) => setAppRoute("photos", projectId)}
                        isFavorite={isProjectFavorite}
                        onToggleFavorite={toggleFavoriteProject}
                    />
                )
            ) : (
                <>
                    <section className="space-y-3">
                        <h3 className="font-semibold">{t("photosFeatured")}</h3>
                        <ProjectGrid
                            projectArray={featuredProjectArray}
                            onOpen={(projectId) => setAppRoute("photos", projectId)}
                            isFavorite={isProjectFavorite}
                            onToggleFavorite={toggleFavoriteProject}
                        />
                    </section>
                    <section className="space-y-3">
                        <h3 className="font-semibold">{t("photosAdditional")}</h3>
                        <ProjectGrid
                            projectArray={additionalProjectArray}
                            onOpen={(projectId) => setAppRoute("photos", projectId)}
                            isFavorite={isProjectFavorite}
                            onToggleFavorite={toggleFavoriteProject}
                        />
                    </section>
                </>
            )}
        </div>
    );
}

// ~~
function TabButton({
    label,
    isActive,
    onClick
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
})
{
    return (
        <button
            type="button"
            className={`rounded-lg px-3 py-1.5 text-sm ${
                isActive
                    ? "bg-ink text-white dark:bg-white dark:text-ink"
                    : "bg-line/80 dark:bg-white/10"
            }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

function ProjectGrid({
    projectArray,
    onOpen,
    isFavorite,
    onToggleFavorite
}: {
    projectArray: Array<FeaturedProject | AdditionalProject>;
    onOpen: (projectId: string) => void;
    isFavorite: (projectId: string) => boolean;
    onToggleFavorite: (projectId: string) => void;
})
{
    const { localize } = useI18n();

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {projectArray.map((project) =>
            {
                const localized = localize(project);
                const accent = "accent" in project ? project.accent : "#591BC5";

                return (
                    <article
                        key={project.id}
                        className="overflow-hidden rounded-2xl border border-line/70 bg-white/80 dark:border-white/10 dark:bg-white/5"
                    >
                        <button
                            type="button"
                            className="block w-full text-left"
                            onClick={() => onOpen(project.id)}
                        >
                            <div
                                className="flex h-36 items-end p-4 text-white"
                                style={{
                                    background: project.image
                                        ? undefined
                                        : `linear-gradient(145deg, ${accent}, #16141A)`,
                                    backgroundImage: project.image
                                        ? `linear-gradient(to top, rgba(0,0,0,0.55), transparent), url(${getAssetUrl(project.image)})`
                                        : undefined,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center"
                                }}
                            >
                                <span className="font-semibold">{localized.title}</span>
                            </div>
                        </button>
                        <div className="flex items-center justify-between gap-2 p-3">
                            <p className="line-clamp-2 text-xs text-slateSoft dark:text-white/60">
                                {localized.summary}
                            </p>
                            <button
                                type="button"
                                className={`shrink-0 text-lg ${
                                    isFavorite(project.id) ? "text-accent" : "text-slateSoft"
                                }`}
                                aria-pressed={isFavorite(project.id)}
                                aria-label="Favorite"
                                onClick={() => onToggleFavorite(project.id)}
                            >
                                ★
                            </button>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

function CaseStudyView({
    project,
    isFavorite,
    onBack,
    onToggleFavorite
}: {
    project: FeaturedProject;
    isFavorite: boolean;
    onBack: () => void;
    onToggleFavorite: () => void;
})
{
    const { t, localize } = useI18n();
    const localized = localize(project);

    const sectionArray = [
        ["caseOverview", localized.overview],
        ["caseRole", localized.role],
        ["caseChallenge", localized.challenge],
        ["caseApproach", localized.approach],
        ["caseArchitecture", localized.architecture],
        ["caseResults", localized.results]
    ] as const;

    return (
        <div className="space-y-5 p-5">
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    className="text-sm font-semibold text-accent"
                    onClick={onBack}
                >
                    {t("back")}
                </button>
                <button
                    type="button"
                    className={`text-lg ${isFavorite ? "text-accent" : "text-slateSoft"}`}
                    aria-pressed={isFavorite}
                    onClick={onToggleFavorite}
                >
                    ★
                </button>
            </div>
            <div>
                <p className="text-sm text-accent">{localized.category}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold">{localized.title}</h3>
                <p className="mt-2 text-sm text-slateSoft dark:text-white/70">{localized.summary}</p>
            </div>
            <div>
                <h4 className="mb-2 font-semibold">{t("caseDemo")}</h4>
                <ProjectMedia
                    title={localized.title}
                    accent={project.accent}
                    media={project.media}
                />
            </div>
            {sectionArray.map(([keyName, bodyText]) => (
                <section key={keyName}>
                    <h4 className="font-semibold">{t(keyName)}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-slateSoft dark:text-white/70">
                        {bodyText}
                    </p>
                </section>
            ))}
            <section>
                <h4 className="font-semibold">{t("caseTechnologies")}</h4>
                <ul className="mt-2 flex flex-wrap gap-2">
                    {localized.technologies.map((technologyName) => (
                        <li
                            key={technologyName}
                            className="rounded-lg bg-line/80 px-2.5 py-1 text-xs dark:bg-white/10"
                        >
                            {technologyName}
                        </li>
                    ))}
                </ul>
            </section>
            {project.hasPublicUrl && project.url ? (
                <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white"
                >
                    {t("photosVisit")}
                </a>
            ) : null}
        </div>
    );
}
