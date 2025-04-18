import { Faq } from 'components/Faq/Faq';
import { PublicLayout } from 'layout/PublicLayout';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'FAQ',
    path: '/faq',
  },
];

const FaqPage = () => {
  return (
    <PublicLayout 
      breadcrumb={breadcrumbsData} 
      breadcrumbTitle='Search Anything'
    >
      <Faq />
    </PublicLayout>
  );
};

export default FaqPage;
