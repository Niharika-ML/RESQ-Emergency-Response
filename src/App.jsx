import { useState } from "react";

import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Dashboard from "./Dashboard.jsx";

import Ambulances from "./Ambulances.jsx";
import AmbulancesRoute from "./AmbulancesRoute.jsx";
import EmergencyRoute from "./EmergencyRoute.jsx";

import Hospitals from "./Hospitals.jsx";
import MedicineStore from "./MedicineStore.jsx";

import Profile from "./Profile.jsx";
import Language from "./Language.jsx";

import { LanguageProvider } from "./LanguageContext.jsx";


function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}


function AppContent() {
  // -----------------------------------------
  // LOAD SAVED PROFILE
  // -----------------------------------------

  const getSavedProfile = () => {
    try {
      const saved = localStorage.getItem("resqProfile");

      if (saved) {
        return JSON.parse(saved);
      }

      return null;
    } catch (error) {
      console.error(
        "Unable to load RESQ profile:",
        error
      );

      return null;
    }
  };


  const savedProfile = getSavedProfile();


  // -----------------------------------------
  // PAGE STATE
  // -----------------------------------------

  const [page, setPage] = useState("login");


  // -----------------------------------------
  // USER NAME
  // -----------------------------------------

  const [userName, setUserName] = useState(
    savedProfile?.fullName || "User"
  );


  // -----------------------------------------
  // SELECTED AMBULANCE
  // -----------------------------------------

  const [selectedAmbulance, setSelectedAmbulance] =
    useState(null);


  // -----------------------------------------
  // LOGIN
  // -----------------------------------------

  const handleLogin = (name) => {
    const latestProfile = getSavedProfile();

    const profileName =
      latestProfile?.fullName ||
      name ||
      "User";

    setUserName(profileName);

    setPage("dashboard");
  };


  // -----------------------------------------
  // SIGNUP
  // -----------------------------------------

  const handleSignup = (name) => {
    setUserName(name || "User");

    setPage("dashboard");
  };


  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------

  const handleLogout = () => {
    setSelectedAmbulance(null);

    setPage("login");
  };


  // -----------------------------------------
  // OPEN AMBULANCE ROUTE
  // -----------------------------------------

  const openAmbulanceRoute = (ambulance) => {
    setSelectedAmbulance(ambulance);

    setPage("ambulanceRoute");
  };


  // -----------------------------------------
  // PROFILE UPDATE
  // -----------------------------------------

  const handleProfileUpdate = (updatedProfile) => {
    if (updatedProfile?.fullName) {
      setUserName(updatedProfile.fullName);
    }
  };


  // -----------------------------------------
  // DASHBOARD
  // -----------------------------------------

  if (page === "dashboard") {
    return (
      <Dashboard
        userName={userName}

        onLogout={handleLogout}

        onHospitals={() => {
          setPage("hospitals");
        }}

        onMedicineStore={() => {
          setPage("medicine");
        }}

        onAmbulance={() => {
          setPage("ambulance");
        }}

        onRoute={() => {
          setPage("route");
        }}

        onProfile={() => {
          setPage("profile");
        }}

        onLanguage={() => {
          setPage("language");
        }}

        onHistory={() => {
          setPage("history");
        }}

        onHowWorks={() => {
          setPage("howWorks");
        }}

        onAbout={() => {
          setPage("about");
        }}
      />
    );
  }


  // -----------------------------------------
  // AMBULANCES
  // -----------------------------------------

  if (page === "ambulance") {
    return (
      <Ambulances
        onBack={() => {
          setPage("dashboard");
        }}

        onRoute={openAmbulanceRoute}
      />
    );
  }


  // -----------------------------------------
  // SELECTED AMBULANCE ROUTE
  // -----------------------------------------

  if (page === "ambulanceRoute") {
    return (
      <AmbulancesRoute
        ambulance={selectedAmbulance}

        onBack={() => {
          setPage("ambulance");
        }}
      />
    );
  }


  // -----------------------------------------
  // EMERGENCY ROUTE
  // -----------------------------------------

  if (page === "route") {
    return (
      <EmergencyRoute
        onBack={() => {
          setPage("dashboard");
        }}
      />
    );
  }


  // -----------------------------------------
  // HOSPITALS
  // -----------------------------------------

  if (page === "hospitals") {
    return (
      <Hospitals
        onBack={() => {
          setPage("dashboard");
        }}
      />
    );
  }


  // -----------------------------------------
  // MEDICINE STORE
  // -----------------------------------------

  if (page === "medicine") {
    return (
      <MedicineStore
        onBack={() => {
          setPage("dashboard");
        }}
      />
    );
  }


  // -----------------------------------------
  // PROFILE
  // -----------------------------------------

  if (page === "profile") {
    return (
      <Profile
        userName={userName}

        onBack={() => {
          setPage("dashboard");
        }}

        onProfileUpdate={handleProfileUpdate}
      />
    );
  }


  // -----------------------------------------
  // LANGUAGE
  // -----------------------------------------

  if (page === "language") {
    return (
      <Language
        onBack={() => {
          setPage("dashboard");
        }}
      />
    );
  }


  // -----------------------------------------
  // LOGIN
  // -----------------------------------------

  if (page === "login") {
    return (
      <Login
        onLogin={handleLogin}

        onSignup={() => {
          setPage("signup");
        }}
      />
    );
  }


  // -----------------------------------------
  // SIGNUP
  // -----------------------------------------

  if (page === "signup") {
    return (
      <Signup
        onSignup={handleSignup}

        onLogin={() => {
          setPage("login");
        }}
      />
    );
  }


  // -----------------------------------------
  // FALLBACK
  // -----------------------------------------

  return (
    <Login
      onLogin={handleLogin}

      onSignup={() => {
        setPage("signup");
      }}
    />
  );
}


export default App;