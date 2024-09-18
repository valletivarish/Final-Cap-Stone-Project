import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const InactivityHandler = () => {
  const navigate = useNavigate();
  const timeoutDuration = 15 * 60 * 1000; 
  let inactivityTimer;

  const resetTimer = useCallback(() => {
    if (inactivityTimer) clearTimeout(inactivityTimer);

    inactivityTimer = setTimeout(() => {

      localStorage.clear();

      navigate("/"); 
    }, timeoutDuration);
  }, [navigate]);

  useEffect(() => {
    resetTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [resetTimer]);

  return null; 
};

export default InactivityHandler;
