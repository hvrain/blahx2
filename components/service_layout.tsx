import Head from 'next/head';

type Props = {
  title?: string;
  children: React.ReactNode;
};

const ServiceLayout: React.FC<Props> = function ({ title = 'blahx2', children }) {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </div>
  );
};

export default ServiceLayout;
