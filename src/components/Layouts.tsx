import { Outlet, ScrollRestoration, useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import TopBanner from "./baner";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./ErrorBoundary";
const SideBar = lazy(() => import("./sideBar"));

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showBanner, setShowBanner] = useState(true);
  const [loadExtraUI, setLoadExtraUI] = useState(false);

  // 🔥 דחייה קלה של UI לא קריטי
  useEffect(() => {
    const timer = setTimeout(() => setLoadExtraUI(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isBannerClosed = sessionStorage.getItem("isBannerClosed");
    if (isBannerClosed) setShowBanner(false);
  }, []);

  const handleCloseBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem("isBannerClosed", "true");
  };

  const handleRegisterClick = () => navigate("/sign-in");
  const handleLoginClick = () => console.log("פתח פופאפ התחברות");

  return (
    <>
      {/* 🔥 Banner נטען רק אחרי render ראשון */}
      {loadExtraUI && (
        <TopBanner
          isVisible={showBanner}
          onRegister={handleRegisterClick}
          onLogin={handleLoginClick}
          onClose={handleCloseBanner}
        />
      )}

      {/* <Header /> */}

      {/* 🔥 Sidebar ב־lazy עם loader קטן */}
      {loadExtraUI && (
        <Suspense fallback={<div className="loader">טוען תפריט...</div>}>
          {/* <SideBar /> */}
        </Suspense>
      )}

      <main>
        {/* 🔥 ErrorBoundary כדי שכל שגיאה לא תקרוס את האתר */}
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {loadExtraUI && <ToastContainer />}

      <ScrollRestoration />
      <Footer />
    </>
  );
};

export default Layout;