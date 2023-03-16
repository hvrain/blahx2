/* eslint-disable react/jsx-props-no-spreading */
import { BoxProps, Box } from '@chakra-ui/react';
import Head from 'next/head';
import GNB from './GNB';

type Props = {
  title?: string;
  children: React.ReactNode;
};

const ServiceLayout: React.FC<Props & BoxProps> = function ({ title = 'blahx2', children, ...boxProps }) {
  return (
    <Box {...boxProps}>
      <Head>
        <title>{title}</title>
      </Head>
      <GNB />
      {children}
    </Box>
  );
};

export default ServiceLayout;
