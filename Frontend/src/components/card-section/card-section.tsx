import styles from './card-section.module.scss';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
/**
 * A straightforward Card Section Component
 */
export const CardSection = () => {
    const navigate = useNavigate();
    const handleRedirect = (path: string) => {
        navigate(path);
    };

    return (
        <div className={styles.root}>
            <button className={classNames(styles['categories-buttons'], styles['cb4-button'])} onClick={() => handleRedirect('/popular-camps')}>
                Populárne miesta
            </button>
            <button className={classNames(styles['categories-buttons'], styles['cb3-button'])} onClick={() => handleRedirect('/gadgets')}>
                Kempingové vybavenie
            </button>
            <button className={classNames(styles['categories-buttons'], styles['cb2-button'])} onClick={() => handleRedirect('/reviews')}>
                Recenzie a skúsenosti
            </button>
            <button className={classNames(styles['categories-buttons'], styles['cb1-button'])} onClick={() => handleRedirect('/additional-services')}>
                Doplnkové služby
            </button>
        </div>
    );
};