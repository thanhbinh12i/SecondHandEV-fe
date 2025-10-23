import { createContext } from "react";
import { MemberDto } from "src/types/user.type";
import { getProfileFromLS } from "src/utils/utils";

export interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: MemberDto | null;
  setProfile: (profile: MemberDto | null) => void;
  reset: () => void;
}

export const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getProfileFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);
