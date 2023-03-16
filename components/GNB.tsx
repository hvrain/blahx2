import { Box, Flex, Spacer, Button } from '@chakra-ui/react';
import { useAuth } from '../contexts/auth_user.context';

const GNB = function () {
  const { authUser, isLoading, signInWithGoogle, signOut } = useAuth();
  const authInitialized = isLoading || authUser === null;

  const loginButton = (
    <Button bgColor="pink.400" color="white" borderRadius="md" onClick={signInWithGoogle}>
      로그인
    </Button>
  );

  const logoutButton = (
    <Button as="a" onClick={signOut}>
      로그아웃
    </Button>
  );

  return (
    <Box w="full" bgColor="white" p="3" borderBottom={1} borderStyle="solid" borderColor="gray.200">
      <Flex justify="space-between">
        <Spacer flex="1" />
        <Box flex="1">
          <img style={{ height: '40px' }} src="/logo.svg" alt="로고" />
        </Box>
        {authInitialized ? loginButton : logoutButton}
      </Flex>
    </Box>
  );
};

export default GNB;
