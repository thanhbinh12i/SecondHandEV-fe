/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { useAccountMe } from "src/queries/useUser";
import { MemberDto } from "src/types/user.type";
import { getProfileFromLS, setProfileToLS } from "src/utils/utils";

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: MemberDto | null;
  setProfile: (profile: MemberDto | null) => void;
  reset: () => void;
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getProfileFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAppContext.isAuthenticated
  );
  const [profile, setProfile] = useState<MemberDto | null>(
    initialAppContext.profile
  );

  const { data, isSuccess, isError } = useAccountMe();

  const handleSetProfile = (profile: MemberDto | null) => {
    setProfile(profile);
    setProfileToLS(profile);
    setIsAuthenticated(Boolean(profile));
  };

  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
    setProfileToLS(null);
  };

  useEffect(() => {
    if (isSuccess && data?.data) {
      handleSetProfile(data?.data);
    } else if (isError) {
      reset();
    }
  }, [isSuccess, isError, data]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile: handleSetProfile,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
