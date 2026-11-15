import { useMemo, useState } from "react";
import {
    experienceArray,
    getAssetUrl,
    profileCopy,
    profileLinks,
    skillGroupArray,
    testimonialArray
} from "../../content";
import { CompanyMark } from "../../components/CompanyMark";
import { useI18n } from "../../i18n/I18nProvider";

// -- TYPES
type SidebarTab = "work" | "education" | "stack";

// -- OPERATIONS
export default function ContactsApp()
{
    const { t, localize } = useI18n();
    const profile = localize(profileCopy);
    const [sidebarTab, setSidebarTab] = useState<SidebarTab>("work");

    const workArray = useMemo(
        () => experienceArray.filter((entry) => entry.track === "career"),
        []
    );
    const educationArray = useMemo(
        () => experienceArray.filter((entry) => entry.track === "education"),
        []
    );

    const channelArray = [
        {
            id: "email",
            label: t("contactsEmail"),
            href: `mailto:${profileLinks.email}`
        },
        {
            id: "github",
            label: t("contactsGithub"),
            href: profileLinks.github
        },
        {
            id: "linkedin",
            label: t("contactsLinkedin"),
            href: profileLinks.linkedin
        }
    ];

    if (profileLinks.whatsapp)
    {
        channelArray.push({
            id: "whatsapp",
            label: t("contactsWhatsapp"),
            href: profileLinks.whatsapp
        });
    }

    return (
        <div className="grid min-h-full lg:h-full lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="border-b border-line bg-white/70 p-4 dark:border-white/10 dark:bg-white/5 lg:border-b-0 lg:border-r lg:overflow-auto">
                <div className="flex items-center gap-3">
                    {profileLinks.avatar ? (
                        <img
                            src={getAssetUrl(profileLinks.avatar)}
                            alt=""
                            className="h-16 w-16 rounded-full object-cover ring-2 ring-accent/50 shadow-soft"
                        />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
                            {profile.initials}
                        </div>
                    )}
                    <div>
                        <h3 className="font-display text-lg font-semibold">{profile.name}</h3>
                        <p className="text-sm text-accent">{profile.status}</p>
                    </div>
                </div>
                <p className="mt-4 text-sm text-slateSoft dark:text-white/70">
                    {profile.statusMessage}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {channelArray.map((channel) => (
                        <a
                            key={channel.id}
                            href={channel.href}
                            target={channel.id === "email" ? undefined : "_blank"}
                            rel={channel.id === "email" ? undefined : "noreferrer"}
                            className="rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-white"
                        >
                            {channel.label}
                        </a>
                    ))}
                </div>
                <div className="mt-6 flex gap-2">
                    {(
                        [
                            ["work", t("contactsWork")],
                            ["education", t("contactsEducation")],
                            ["stack", t("contactsStack")]
                        ] as Array<[SidebarTab, string]>
                    ).map(([tabId, label]) => (
                        <button
                            key={tabId}
                            type="button"
                            className={`rounded-lg px-2.5 py-1 text-sm ${
                                sidebarTab === tabId
                                    ? "bg-ink text-white dark:bg-white dark:text-ink"
                                    : "bg-line/80 dark:bg-white/10"
                            }`}
                            onClick={() => setSidebarTab(tabId)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="mt-4 space-y-3 text-sm">
                    {sidebarTab === "work"
                        ? workArray.map((entry) =>
                        {
                            const localized = localize(entry);
                            return (
                                <div key={entry.id} className="flex gap-2">
                                    <CompanyMark
                                        companyName={localized.company}
                                        logo={entry.logo}
                                        sizeClassName="h-8 w-8"
                                    />
                                    <div>
                                        <p className="font-semibold">{localized.company}</p>
                                        <p className="text-slateSoft dark:text-white/60">
                                            {localized.role}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                        : null}
                    {sidebarTab === "education"
                        ? (
                            educationArray.length > 0
                                ? educationArray.map((entry) =>
                                {
                                    const localized = localize(entry);
                                    return (
                                        <div key={entry.id}>
                                            <p className="font-semibold">{localized.company}</p>
                                            <p className="text-slateSoft dark:text-white/60">
                                                {localized.role}
                                            </p>
                                            <p className="text-xs text-slateSoft dark:text-white/50">
                                                {localized.period}
                                            </p>
                                        </div>
                                    );
                                })
                                : (
                                    <p className="text-slateSoft dark:text-white/60">
                                        {profile.aboutParagraphArray[0]}
                                    </p>
                                )
                        )
                        : null}
                    {sidebarTab === "stack"
                        ? skillGroupArray.map((group) =>
                        {
                            const localized = localize(group);
                            return (
                                <div key={group.id}>
                                    <p className="font-semibold">{localized.title}</p>
                                    <p className="text-slateSoft dark:text-white/60">
                                        {localized.items.slice(0, 4).join(" · ")}
                                    </p>
                                </div>
                            );
                        })
                        : null}
                </div>
            </aside>
            <section className="space-y-6 p-5">
                <div>
                    <h3 className="font-display text-xl font-semibold">{t("contactsAbout")}</h3>
                    {profile.aboutParagraphArray.map((paragraphText) => (
                        <p
                            key={paragraphText}
                            className="mt-3 text-sm leading-relaxed text-slateSoft dark:text-white/75"
                        >
                            {paragraphText}
                        </p>
                    ))}
                </div>
                <div>
                    <h3 className="font-display text-xl font-semibold">{t("contactsMessages")}</h3>
                    <ul className="mt-4 space-y-3">
                        {testimonialArray.map((testimonial) =>
                        {
                            const localized = localize(testimonial);

                            return (
                                <li
                                    key={testimonial.id}
                                    className="flex gap-3 rounded-2xl bg-white/80 p-3 dark:bg-white/5"
                                >
                                    <img
                                        src={getAssetUrl(testimonial.image)}
                                        alt=""
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="whitespace-pre-line text-sm leading-relaxed">{localized.quote}</p>
                                        <p className="mt-2 text-xs font-semibold">
                                            {localized.name}
                                        </p>
                                        <p className="text-xs text-slateSoft dark:text-white/55">
                                            {localized.role}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>
        </div>
    );
}
