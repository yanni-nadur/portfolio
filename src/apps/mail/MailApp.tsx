import { useState } from "react";
import { getAssetUrl, profileLinks } from "../../content";
import { useI18n } from "../../i18n/I18nProvider";

// -- OPERATIONS
export default function MailApp()
{
    const { t } = useI18n();
    const [subjectText, setSubjectText] = useState(() => t("mailSubjectDefault"));
    const [bodyText, setBodyText] = useState(() => t("mailBodyDefault"));

    function handleSend()
    {
        const mailtoUrl = `mailto:${profileLinks.email}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
        window.location.href = mailtoUrl;
    }

    return (
        <div className="grid h-full gap-0 lg:grid-cols-[minmax(0,1fr)_240px]">
            <section className="space-y-4 p-5">
                <h3 className="font-display text-xl font-semibold">{t("mailCompose")}</h3>
                <label className="block space-y-1 text-sm">
                    <span className="font-semibold">{t("mailTo")}</span>
                    <input
                        className="w-full rounded-xl border border-line bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5"
                        value={profileLinks.email}
                        readOnly
                    />
                </label>
                <label className="block space-y-1 text-sm">
                    <span className="font-semibold">{t("mailSubject")}</span>
                    <input
                        className="w-full rounded-xl border border-line bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5"
                        value={subjectText}
                        onChange={(event) => setSubjectText(event.target.value)}
                    />
                </label>
                <label className="block space-y-1 text-sm">
                    <span className="font-semibold">{t("mailBody")}</span>
                    <textarea
                        className="min-h-48 w-full rounded-xl border border-line bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5"
                        value={bodyText}
                        onChange={(event) => setBodyText(event.target.value)}
                    />
                </label>
                <button
                    type="button"
                    className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
                    onClick={handleSend}
                >
                    {t("mailSend")}
                </button>
            </section>
            <aside className="border-t border-line p-5 dark:border-white/10 lg:border-l lg:border-t-0">
                <h4 className="font-semibold">{t("mailChannels")}</h4>
                <ul className="mt-3 space-y-2 text-sm">
                    <li>
                        <a className="text-accent" href={`mailto:${profileLinks.email}`}>
                            {profileLinks.email}
                        </a>
                    </li>
                    <li>
                        <a className="text-accent" href={profileLinks.github} target="_blank" rel="noreferrer">
                            GitHub
                        </a>
                    </li>
                    <li>
                        <a className="text-accent" href={profileLinks.linkedin} target="_blank" rel="noreferrer">
                            LinkedIn
                        </a>
                    </li>
                </ul>
                <div className="mt-6 space-y-2">
                    <a
                        className="block rounded-lg bg-line/80 px-3 py-2 text-sm font-semibold dark:bg-white/10"
                        href={getAssetUrl(profileLinks.resumeEn)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t("mailResumeEn")}
                    </a>
                    <a
                        className="block rounded-lg bg-line/80 px-3 py-2 text-sm font-semibold dark:bg-white/10"
                        href={getAssetUrl(profileLinks.resumePt)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t("mailResumePt")}
                    </a>
                </div>
            </aside>
        </div>
    );
}
