import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PAGES_URL, THEMES_URL } from "../config";
import {
    getPageKey,
    buildInactivePage,
    applyTheme,
    applyFavicon
} from "../utils/maintenanceHelpers";

export default function MaintenancePage({ mode, slugOverride }) {
    const { slug } = useParams();

    const [page, setPage] = useState(null);
    const [theme, setTheme] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadMaintenanceData() {
            try {
                const [pagesRes, themesRes] = await Promise.all([
                    fetch(PAGES_URL),
                    fetch(THEMES_URL)
                ]);

                if (!pagesRes.ok) throw new Error(`Pages JSON failed: ${pagesRes.status}`);
                if (!themesRes.ok) throw new Error(`Themes JSON failed: ${themesRes.status}`);

                const pagesData = await pagesRes.json();
                const themesData = await themesRes.json();

                const pages = pagesData.pages;
                const themes = themesData.themes;

                const pageKey = getPageKey(mode, slug, slugOverride);

                let selectedPage = pages[pageKey] || pages["custom-default"];

                if (!selectedPage.is_active) {
                    selectedPage = buildInactivePage(selectedPage, pages["inactive-default"]);
                }

                const selectedTheme =
                    themes[selectedPage.themeSlug] || themes["plain"] || themes["beedev"];

                applyTheme(selectedTheme);
                applyFavicon(selectedTheme.favicon);

                setPage(selectedPage);
                setTheme(selectedTheme);
            } catch (err) {
                console.error(err);
                setError("We’re having trouble loading this maintenance page.");
            }
        }

        loadMaintenanceData();
    }, [mode, slug, slugOverride]);

    if (error) {
        return (
            <main className="maintenance-page">
                <section className="maintenance-card">
                    <h1>We’ll be right back.</h1>
                    <p>{error}</p>
                </section>
            </main>
        );
    }

    if (!page || !theme) {
        return (
            <main className="maintenance-page">
                <section className="maintenance-card">
                    <p>Loading maintenance page...</p>
                </section>
            </main>
        );
    }

    return (
        <main className={`maintenance-page maintenance-${page.type}`}>
            <section className="maintenance-card">
                {page.showLogo && (
                    <img
                        src={
                            theme.logo ||
                            "https://images.thehive-services.com/beeDevServices/Logo_2.png"
                        }
                        alt={`${page.siteName} logo`}
                        className="maintenance-logo"
                    />
                )}

                <div className="bee-icon">🐝</div>

                <p className="maintenance-status">{page.status}</p>

                <h1>{page.headline}</h1>

                <p className="maintenance-site-name">{page.siteName}</p>

                <p className="maintenance-message">{page.message}</p>

                {page.showEstimatedReturn && page.estimatedReturn && (
                    <div className="maintenance-return">
                        <strong>Estimated return:</strong>
                        <span>{page.estimatedReturn}</span>
                    </div>
                )}

                {page.siteUrl && (
                    <a className="maintenance-button" href={page.siteUrl}>
                        {page.returnButtonText || "Return to Website"}
                    </a>
                )}

                {page.showContact && page.contactEmail && (
                    <p className="maintenance-contact">
                        Need help?{" "}
                        <a href={`mailto:${page.contactEmail}`}>{page.contactEmail}</a>
                    </p>
                )}

                {theme.footerText && (
                    <p className="maintenance-footer">{theme.footerText}</p>
                )}
            </section>
        </main>
    );
}