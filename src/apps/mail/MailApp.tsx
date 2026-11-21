import { useState } from "react";
import { getAssetUrl, profileLinks } from "../../content";
import { useI18n } from "../../i18n/I18nProvider";

// -- TYPES
type CopyStatus = "idle" | "copied" | "failed";

// -- OPERATIONS
export default function MailApp()
{
    const { t, language } = useI18n();
    const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
    const hasResumeEn = Boolean(profileLinks.resumeEn);
    const hasResumePt = Boolean(profileLinks.resumePt);
    const hasResume = hasResumeEn || hasResumePt;
    const preferredResumePath = language === "pt" && hasResumePt
        ? profileLinks.resumePt
        : hasResumeEn
            ? profileLinks.resumeEn
            : profileLinks.resumePt;

    async function handleCopyEmail()
    {
        try
        {
            await navigator.clipboard.writeText(profileLinks.email);
            setCopyStatus("copied");
            window.setTimeout(() => setCopyStatus("idle"), 2000);
        }
        catch
        {
            setCopyStatus("failed");
            window.prompt(t("mailCopyEmailFallback"), profileLinks.email);
            window.setTimeout(() => setCopyStatus("idle"), 2500);
        }
    }

    function handleSendEmail()
    {
        const subjectText = t("mailSubjectDefault");
        const bodyText = t("mailBodyDefault");
        const mailtoUrl = `mailto:${profileLinks.email}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
        window.location.href = mailtoUrl;
    }

    const actionClassName = "inline-flex min-h-10 items-center justify-center rounded-xl bg-accent px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-accentDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
    const secondaryActionClassName = "inline-flex min-h-10 items-center justify-center rounded-xl border border-line/90 bg-white/80 px-3.5 py-2 text-sm font-semibold text-ink transition hover:border-accent/50 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-white/15 dark:bg-white/5 dark:text-mist dark:hover:border-[#F2C14B]/50 dark:hover:text-[#F2C14B]";

    return (
        <div className="mail-contact-app h-full overflow-auto bg-[#FFFDF9]/88 p-4 dark:bg-black/25 sm:p-5">
            <header className="max-w-3xl">
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                    {t("mailTitle")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slateSoft dark:text-white/70">
                    {t("mailIntro")}
                </p>
            </header>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <section className="rounded-2xl border border-line/80 bg-white/90 p-4 dark:border-white/10 dark:bg-white/[0.06] sm:col-span-2">
                    <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="m4 7 8 6 8-6" />
                            </svg>
                        </span>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-semibold">{t("mailEmailTitle")}</h4>
                            <p className="mt-1 text-sm text-slateSoft dark:text-white/60">
                                {t("mailEmailDescription")}
                            </p>
                            <p className="mt-2 truncate text-sm font-medium">{profileLinks.email}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className={actionClassName}
                                    onClick={handleSendEmail}
                                >
                                    {t("mailSend")}
                                </button>
                                <button
                                    type="button"
                                    className={secondaryActionClassName}
                                    onClick={handleCopyEmail}
                                >
                                    {copyStatus === "copied" ? t("mailCopyEmailDone") : t("mailCopyEmail")}
                                </button>
                            </div>
                            <p className="sr-only" aria-live="polite">
                                {copyStatus === "copied"
                                    ? t("mailCopyEmailDone")
                                    : copyStatus === "failed"
                                        ? t("mailCopyEmailFallback")
                                        : ""}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-line/80 bg-white/90 p-4 dark:border-white/10 dark:bg-white/[0.06]">
                    <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A66C2]/12 text-[#0A66C2] dark:bg-[#0A66C2]/20 dark:text-[#7EB6EF]">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
                                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.2 0 22.23 0Z" />
                            </svg>
                        </span>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-semibold">{t("mailLinkedinTitle")}</h4>
                            <p className="mt-1 text-sm text-slateSoft dark:text-white/60">
                                {t("mailLinkedinDescription")}
                            </p>
                            <a
                                className={`${secondaryActionClassName} mt-3`}
                                href={profileLinks.linkedin}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t("mailOpenLinkedin")}
                            </a>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-line/80 bg-white/90 p-4 dark:border-white/10 dark:bg-white/[0.06]">
                    <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink/8 text-ink dark:bg-white/10 dark:text-mist">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
                                <path d="M12 .3C5.37.3 0 5.67 0 12.3c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 24 12.3C24 5.67 18.63.3 12 .3Z" />
                            </svg>
                        </span>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-semibold">{t("mailGithubTitle")}</h4>
                            <p className="mt-1 text-sm text-slateSoft dark:text-white/60">
                                {t("mailGithubDescription")}
                            </p>
                            <a
                                className={`${secondaryActionClassName} mt-3`}
                                href={profileLinks.github}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t("mailOpenGithub")}
                            </a>
                        </div>
                    </div>
                </section>

                {hasResume ? (
                    <section className="rounded-2xl border border-line/80 bg-white/90 p-4 dark:border-white/10 dark:bg-white/[0.06] sm:col-span-2">
                        <div className="flex items-start gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#B45309]/12 text-[#B45309] dark:bg-[#B45309]/20 dark:text-[#F0B27A]">
                                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                                    <path d="M14 3v5h5" />
                                    <path d="M9 13h6M9 17h6" />
                                </svg>
                            </span>
                            <div className="min-w-0 flex-1">
                                <h4 className="font-semibold">{t("mailResumeTitle")}</h4>
                                <p className="mt-1 text-sm text-slateSoft dark:text-white/60">
                                    {t("mailResumeDescription")}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {preferredResumePath ? (
                                        <a
                                            className={actionClassName}
                                            href={getAssetUrl(preferredResumePath)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {t("mailViewResume")}
                                        </a>
                                    ) : null}
                                    {hasResumeEn ? (
                                        <a
                                            className={secondaryActionClassName}
                                            href={getAssetUrl(profileLinks.resumeEn)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {t("mailResumeEn")}
                                        </a>
                                    ) : null}
                                    {hasResumePt ? (
                                        <a
                                            className={secondaryActionClassName}
                                            href={getAssetUrl(profileLinks.resumePt)}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {t("mailResumePt")}
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </section>
                ) : null}
            </div>
        </div>
    );
}
