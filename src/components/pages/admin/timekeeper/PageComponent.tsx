import { useContext, useState } from 'react';
import { TimekeeperContext } from '../../../contexts';
import SelectAccessType from './SelectAccessType';
import Tutorial from './TutorialPage';
import { Table } from './Table';
import backgroundImageSrc from '../../../../assets/YPS-OB_bg.png';
import { getOptimizedBackgroundUrl } from '@/config/images';

export default function PageComponent() {
	const { step, accessType } = useContext(TimekeeperContext);
	const optimizedBgUrl = getOptimizedBackgroundUrl(backgroundImageSrc);

	const renderStepComponent = () => {
		if (step === 1) {
			return <SelectAccessType />;
		} else if (step === 2) {
			return <Table />;
		} else if ((step === 3 && accessType === 'Hybrid')) {
			return <Table />;
		} else if ((step === 3 && accessType !== 'Hybrid') || (step === 4 && accessType === 'Hybrid')) {
			return <Tutorial />;
		}
		return null;
	};

	return (
		<>
			<div className="flex flex-col justify-center content-center bg-fixed bg-origin-content bg-center bg-no-repeat bg-cover" style={{ height: '75vh', alignItems: 'center', backgroundImage: `url(${optimizedBgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
			    <div className='px-8 py-3 w-full max-w-7xl'>
				  {renderStepComponent()}
				</div>
			</div>
		</>
	);
}