import { NextPage } from 'next';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import ServiceLayout from '@/components/service_layout';
import GoogleLoginButton from '@/components/google_login_button';

const IndexPage: NextPage = function () {
  return (
    <ServiceLayout title="test" bgColor="gray.100" minH="100vh">
      <Box maxW="md" mx="auto" py="4">
        <Flex direction="column" align="center" gap={5}>
          <img src="/blahx2.svg" alt="메인 로고" />
          <Heading pb="10">#BlahBlah</Heading>
          <GoogleLoginButton />
        </Flex>
      </Box>
    </ServiceLayout>
  );
};

export default IndexPage;
