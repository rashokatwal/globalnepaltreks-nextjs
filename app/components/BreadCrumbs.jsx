"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const BreadCrumbs = () => {
    const pathname = usePathname();
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const toWordFormat = (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

    const pathParts = pathname.split("/").filter(Boolean);
    const formattedParts = pathParts.map((part) =>
        toWordFormat(part.replace(/-/g, " "))
    );

    const breadcrumbs = [
        { label: "Home", to: "/" },
        formattedParts[0] && {
            label: formattedParts[0],
            to: formattedParts[1] ? `/${pathParts[0]}` : null,
        },
        formattedParts[1] && {
            label: formattedParts[1],
            to: formattedParts[2] ? `/${pathParts.slice(0, 2).join("/")}` : null,
        },
        formattedParts[2] && {
            label: formattedParts[2],
            to: null,
            active: true,
        },
    ].filter(Boolean);

    // Generate schema only on client side
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            item: crumb.to && origin ? `${origin}${crumb.to}` : undefined,
        })),
    };

    return (
        <>
            {/* Add schema as JSON-LD */}
            {origin && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                />
            )}
            
            <nav
                className="z-10 flex items-center gap-2 text-xs text-white cursor-default md:text-sm"
                aria-label="Breadcrumb"
            >
                {breadcrumbs.map((crumb, index) => (
                    <span key={index} className="flex items-center gap-2">
                        {crumb.to ? (
                            <Link
                                rel="canonical"
                                href={crumb.to}
                                className="underline cursor-pointer hover:no-underline"
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span
                                className={crumb.active ? "text-(--secondary-color)" : ""}
                                aria-current={crumb.active ? "page" : undefined}
                            >
                                {crumb.label}
                            </span>
                        )}

                        {index < breadcrumbs.length - 1 && <span>/</span>}
                    </span>
                ))}
            </nav>
        </>
    );
};

export default BreadCrumbs;