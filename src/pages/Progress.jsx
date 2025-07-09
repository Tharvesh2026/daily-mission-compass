
import { useParams } from 'react-router-dom';
import PublicProgressViewer from '@/components/PublicProgressViewer';

const Progress = () => {
  const { date } = useParams();
  
  return <PublicProgressViewer encryptedDate={date} />;
};

export default Progress;
