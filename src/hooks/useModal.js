import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal state
 * @param {boolean} initialState - Initial open state
 * @returns {Object} Modal state and handlers
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState(null);

  const openModal = useCallback((data = null, type = null) => {
    setModalData(data);
    setModalType(type);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Delay clearing data to allow for exit animations
    setTimeout(() => {
      setModalData(null);
      setModalType(null);
    }, 300);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    modalData,
    modalType,
    openModal,
    closeModal,
    toggleModal,
    setModalData,
  };
};
