export * from "./types";
export * from "./profile";
export * from "./experience";
export * from "./projects";
export * from "./skills";
export * from "./testimonials";
export * from "./ui";

import { additionalProjectArray, featuredProjectArray } from "./projects";

// -- FUNCTIONS
export function getAssetUrl(relativePath: string): string
{
    const normalizedPath = relativePath.replace(/^\//, "");
    return `${import.meta.env.BASE_URL}${normalizedPath}`;
}

export function findFeaturedProject(projectId: string)
{
    return featuredProjectArray.find((project) => project.id === projectId) ?? null;
}

export function findAnyProject(projectId: string)
{
    return (
        featuredProjectArray.find((project) => project.id === projectId)
        ?? additionalProjectArray.find((project) => project.id === projectId)
        ?? null
    );
}
