import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import styles from './dropdown-menu.module.scss';

export const DropdownMenu = ({ username }: { username: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('username'); 
    localStorage.removeItem('role'); 
    navigate('/login'); 
  };

  const handleEdit = () => {
    navigate('/edit-profile'); 
  }

  const handleDashboard = () => {
    if (role === 'admin') {
      navigate('/admin-dashboard'); 
    }
    else {
      navigate('/user-dashboard'); 
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={cx(styles.menuButton, styles.registerButton, { [styles.active]: isOpen })}
      >
        {username}
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <ul>
            <li onClick={handleDashboard}>Prehľad</li>
            <li onClick={handleEdit}>Úprava profilu</li>
            <li onClick={handleLogout}>Odhlásiť sa</li>
          </ul>
        </div>
      )}
    </div>
  );
};