import Bookmark from "./Bookmark";

export const OneByOne = ({ children }) => (
  <div className="w-full lg:w-1/3 relative group">
    <Bookmark />
    {children}
  </div>
);

export const TwoByOne = ({ children }) => (
  <div className="w-full lg:w-2/3 relative group">
    <Bookmark />
    {children}
  </div>
);

export const ThreeByOne = ({ children }) => (
  <div className="w-full relative group">
    <Bookmark />
    {children}
  </div>
);
