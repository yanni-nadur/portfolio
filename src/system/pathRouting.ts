import { isAppId, type AppId } from "./appRegistry";

// -- FUNCTIONS
export function getBasePath(): string
{
    return import.meta.env.BASE_URL.replace(/\/$/, "") || "";
}

export function getPathSegmentArray(pathname: string = window.location.pathname): string[]
{
    const basePath = getBasePath();
    let relativePath = pathname;

    if (basePath && relativePath.startsWith(basePath))
    {
        relativePath = relativePath.slice(basePath.length);
    }

    return relativePath.split("/").filter(Boolean);
}

export function buildAbsolutePath(segmentArray: string[]): string
{
    const basePath = getBasePath();

    if (segmentArray.length === 0)
    {
        return `${basePath}/`;
    }

    return `${basePath}/${segmentArray.join("/")}`;
}

export function migrateLegacyHashRoute(): void
{
    if (typeof window === "undefined")
    {
        return;
    }

    const hashText = window.location.hash;

    if (!hashText)
    {
        return;
    }

    const cleanedHash = hashText.replace(/^#\/?/, "").trim();
    const segmentArray = cleanedHash.split("/").filter(Boolean);
    const nextPath = buildAbsolutePath(segmentArray);

    window.history.replaceState(null, "", nextPath);
}

export function parseViewFromPath(pathname: string = window.location.pathname): "landing" | "simple" | "os"
{
    const firstSegment = getPathSegmentArray(pathname)[0] ?? "";

    if (!firstSegment)
    {
        return "landing";
    }

    if (firstSegment === "simple")
    {
        return "simple";
    }

    if (firstSegment === "os" || isAppId(firstSegment))
    {
        return "os";
    }

    return "landing";
}

export function buildViewPath(
    view: "landing" | "simple" | "os",
    pathname: string = window.location.pathname
): string
{
    if (view === "landing")
    {
        return buildAbsolutePath([]);
    }

    if (view === "simple")
    {
        return buildAbsolutePath(["simple"]);
    }

    const segmentArray = getPathSegmentArray(pathname);
    const firstSegment = segmentArray[0] ?? "";

    if (firstSegment === "os" || isAppId(firstSegment))
    {
        return buildAbsolutePath(segmentArray);
    }

    return buildAbsolutePath(["os"]);
}

export function parseAppFromPath(pathname: string = window.location.pathname): {
    appId: AppId | null;
    route: string | null;
}
{
    const segmentArray = getPathSegmentArray(pathname);

    if (segmentArray.length === 0 || segmentArray[0] === "os")
    {
        if (segmentArray[0] === "os" && segmentArray.length > 1 && isAppId(segmentArray[1]))
        {
            const routeSegmentArray = segmentArray.slice(2);
            return {
                appId: segmentArray[1],
                route: routeSegmentArray.join("/") || null
            };
        }

        return { appId: null, route: null };
    }

    const appSegment = segmentArray[0] ?? "";

    if (!isAppId(appSegment))
    {
        return { appId: null, route: null };
    }

    const routeSegmentArray = segmentArray.slice(1);
    return {
        appId: appSegment,
        route: routeSegmentArray.join("/") || null
    };
}

export function buildAppPath(appId: AppId | null, route: string | null): string
{
    if (!appId)
    {
        return buildAbsolutePath(["os"]);
    }

    if (!route)
    {
        return buildAbsolutePath([appId]);
    }

    return buildAbsolutePath([appId, ...route.split("/").filter(Boolean)]);
}

export function replacePath(nextPath: string): void
{
    if (window.location.pathname !== nextPath || window.location.hash)
    {
        window.history.replaceState(null, "", nextPath);
    }
}
