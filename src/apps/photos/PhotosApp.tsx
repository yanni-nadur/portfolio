import { useEffect, useMemo } from "react";
import { getAllProjectArray, getAssetUrl } from "../../content";
import type { AdditionalProject, FeaturedProject } from "../../content/types";
import { useI18n } from "../../i18n/I18nProvider";
import { useWindows } from "../../system/windowStore";

// -- TYPES
type GalleryProject = FeaturedProject | AdditionalProject;

/*
 * Projects is currently a gallery of cards that open each project's public site.
 * A richer in-app detail view (role, challenges, results) can be rebuilt later
 * from the existing project data without keeping unused UI here.
 */

// -- FUNCTIONS
function isFeaturedProject(project: GalleryProject): project is FeaturedProject
{
    return "featured" in project && project.featured === true;
}

function getProjectImageObjectPosition(projectId: string): string
{
    if (projectId === "karen-oliveira")
    {
        return "center 20%";
    }

    if (projectId === "solon")
    {
        return "center 35%";
    }

    return "center";
}

function compareProjectTitle(
    leftProject: GalleryProject,
    rightProject: GalleryProject,
    language: "en" | "pt"
): number
{
    return leftProject[language].title.localeCompare(rightProject[language].title, language, {
        sensitivity: "base"
    });
}

// -- OPERATIONS
export default function PhotosApp()
{
    const { t, language, localize } = useI18n();
    const { windowByIdMap, setAppRoute } = useWindows();
    const route = windowByIdMap.photos.route;

    const allProjectArray = useMemo(
        () => [...getAllProjectArray()].sort((leftProject, rightProject) =>
            compareProjectTitle(leftProject, rightProject, language)
        ),
        [language]
    );

    useEffect(() =>
    {
        if (route)
        {
            setAppRoute("photos", null);
        }
    }, [route, setAppRoute]);

    return (
        <div className="projects-app flex h-full min-h-0 flex-col">
            <header className="projects-app-header shrink-0 px-4 pb-3 pt-4 sm:px-5">
                <h3 className="font-display text-xl font-semibold tracking-tight">
                    {t("photosTitle")}
                </h3>
                <p className="mt-1 text-xs text-slateSoft dark:text-white/55">
                    {t("photosProjectCount").replace("{count}", String(allProjectArray.length))}
                </p>
            </header>

            <div className="min-h-0 flex-1 overflow-auto px-4 pb-5 sm:px-5">
                <div className="projects-grid">
                    {allProjectArray.map((project) =>
                    {
                        const localized = localize(project);
                        const imageUrl = project.image ? getAssetUrl(project.image) : null;
                        const accent = isFeaturedProject(project) ? project.accent : "#5A6574";
                        const projectUrl = project.hasPublicUrl && project.url ? project.url : null;
                        const cardContent = (
                            <>
                                <div
                                    className="projects-card-media"
                                    style={{
                                        background: imageUrl
                                            ? undefined
                                            : `linear-gradient(145deg, ${accent}, #16141A)`
                                    }}
                                >
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt=""
                                            className="h-full w-full object-cover"
                                            style={{
                                                objectPosition: getProjectImageObjectPosition(project.id)
                                            }}
                                            loading="lazy"
                                        />
                                    ) : null}
                                </div>
                                <div className="projects-card-body">
                                    <h4 className="font-display text-base font-semibold tracking-tight">
                                        {localized.title}
                                    </h4>
                                    <p className="projects-card-summary mt-1.5 text-sm leading-relaxed text-slateSoft dark:text-white/65">
                                        {localized.summary}
                                    </p>
                                </div>
                            </>
                        );

                        if (projectUrl)
                        {
                            return (
                                <a
                                    key={project.id}
                                    href={projectUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="projects-card projects-card-link"
                                    aria-label={`${localized.title}. ${t("photosVisit")}`}
                                >
                                    {cardContent}
                                </a>
                            );
                        }

                        return (
                            <article key={project.id} className="projects-card">
                                {cardContent}
                            </article>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
