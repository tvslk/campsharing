import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./header.module.scss";
import cx from "classnames";
import { DropdownMenu } from "../dropdown-menu/dropdown-menu";

export const Header = ({ className }: { className?: string }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false); 

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername);
    }, []);

    const handleNavigation = (path: string) => {
        navigate(path);
        setMenuOpen(false); 
    };

    return (
        <header className={cx(styles.root, className)}>
            <div
                className={styles.logo}
                onClick={() => handleNavigation("/")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleNavigation("/")}
                aria-label="Domovská stránka"
            >
                CampSharing
            </div>

            <div
                className={cx(styles.burgerMenu, { [styles.active]: menuOpen })}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <div></div>
                <div></div>
                <div></div>
            </div>

            <nav className={cx(styles.menu, { [styles.active]: menuOpen })}>
                <button
                    className={cx(styles.menuButton, styles.active)}
                    onClick={() => handleNavigation("/")}
                    aria-label="Domov"
                >
                    Domov
                </button>
                <button
                    className={styles.menuButton}
                    onClick={() => handleNavigation("/how-it-works")}
                    aria-label="Ako to funguje"
                >
                    Ako to funguje
                </button>
                <button
                    className={styles.menuButton}
                    onClick={() => handleNavigation("/contact")}
                    aria-label="Kontakt"
                >
                    Kontakt
                </button>
                {username ? (
                    <DropdownMenu username={username} />
                ) : (
                    <>
                        <button
                            className={styles.menuButton}
                            onClick={() => handleNavigation("/login")}
                            aria-label="Prihlásiť sa"
                        >
                            Prihlásiť sa
                        </button>
                        <button
                            className={cx(styles.menuButton, styles.registerButton)}
                            onClick={() => handleNavigation("/register")}
                            aria-label="Registrácia"
                        >
                            Registrácia
                        </button>
                    </>
                )}
            </nav>
        </header>
    );
};