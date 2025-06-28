import Home from '../routes/Home';
import type { UserObj } from '../types';

interface PageProps {
  userObj: UserObj | null;
  isMobile: boolean;
}

export default function HomePage({ userObj, isMobile }: PageProps) {
  return <Home userObj={userObj} isMobile={isMobile} />;
}
