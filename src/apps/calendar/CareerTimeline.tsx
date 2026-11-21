import { useMemo } from "react";
import type { ExperienceEntry } from "../../content/types";
import { useI18n } from "../../i18n/I18nProvider";
import { CareerTimelineRow } from "./CareerTimelineRow";
import {
    getBarLayout,
    getCareerMonthBounds,
    getYearMarkerArray
} from "./timelineDates";

// -- TYPES
type CareerTimelineProps = {
    careerArray: ExperienceEntry[];
    selectedExperienceId: string | null;
    onSelectExperience: (experienceId: string) => void;
};

// -- OPERATIONS
export function CareerTimeline({
    careerArray,
    selectedExperienceId,
    onSelectExperience
}: CareerTimelineProps)
{
    const { t } = useI18n();
    const bounds = useMemo(() => getCareerMonthBounds(careerArray), [careerArray]);
    const yearMarkerArray = useMemo(() => getYearMarkerArray(bounds), [bounds]);

    return (
        <section className="timeline-gantt" aria-label={t("calendarCareer")}>
            <div className="timeline-scale-row" aria-hidden="true">
                <div className="timeline-legend">
                    <span className="timeline-legend-item">
                        <span className="timeline-legend-swatch timeline-bar-current" />
                        {t("calendarLegendCurrent")}
                    </span>
                    <span className="timeline-legend-item">
                        <span className="timeline-legend-swatch timeline-bar-past" />
                        {t("calendarLegendPast")}
                    </span>
                </div>
                <div className="timeline-year-scale">
                    {yearMarkerArray.map((marker) => (
                        <span key={marker.year} className="timeline-year-marker">
                            {marker.year}
                        </span>
                    ))}
                </div>
            </div>

            <div className="timeline-row-list">
                {careerArray.map((entry) => (
                    <CareerTimelineRow
                        key={entry.id}
                        entry={entry}
                        barLayout={getBarLayout(entry, bounds)}
                        isSelected={selectedExperienceId === entry.id}
                        onSelect={onSelectExperience}
                    />
                ))}
            </div>
        </section>
    );
}
