import CreateBtn from './CreateBtn';
import DownloadUpload from './DownloadUpload';
import EmployeeWrapper from './EmployeeContext';
import EmployeeRegistrationWrapper from './EmployeeRegistrationContext';
import Footer from './Footer';
import Header from './Header';
import SearchBar from './SearchBar';
import TableWrapper from './TableWrapper';
import { getOptimizedBackgroundUrl } from '@/config/images';
import backgroundImageSrc from '@/assets/YPS-OB_bg.png';

export default function Content() {
  const optimizedBgUrl = getOptimizedBackgroundUrl(backgroundImageSrc);
  
  return (
    <div className="h-screen text-sm bg-slate-50">
        <EmployeeRegistrationWrapper>
          <Header />
          <EmployeeWrapper>
            <div 
              className="flex flex-col justify-center items-center bg-fixed bg-origin-content bg-center bg-no-repeat bg-cover" 
              style={{ 
                height: '75vh', 
                backgroundImage: `url(${optimizedBgUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
              <div className="px-8 py-6 w-full max-w-5xl">
                <DownloadUpload />
              </div>
              <div className="px-8 py-6 space-y-4 w-full max-w-5xl bg-white rounded outline outline-1 outline-slate-300">
                <div className="flex justify-between">
                  <SearchBar />
                  <CreateBtn />
                </div>
                <TableWrapper />
              </div>
            </div>
          </EmployeeWrapper>
          <Footer />
        </EmployeeRegistrationWrapper>
    </div>
  );
}
