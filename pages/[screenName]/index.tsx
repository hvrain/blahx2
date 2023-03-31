import { GetServerSideProps, NextPage } from 'next';
import { Avatar, Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';
import ServiceLayout from '@/components/service_layout';
import QuestionForm from '@/components/question_form';
import { InAuthUser } from '@/models/in_auth_user';
import MessageItem from '@/components/message_item';

type Props = {
  userInfo: InAuthUser | null;
};

const BROKEN_LINK = 'https://bit.ly/broken-link';

const UserHomePage: NextPage<Props> = function ({ userInfo }) {
  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }

  return (
    <ServiceLayout title={`${userInfo.displayName}의 홈`} bgColor="gray.100" minH="100vh">
      <Flex maxW="md" mx="auto" pt="6" direction="column" gap="2">
        <Box bgColor="white" px="3" py="2" borderRadius="md" overflow="hidden">
          <Flex gap="2">
            <Avatar size="lg" name="test" src={userInfo.photoURL ?? BROKEN_LINK} />
            <Flex direction="column" justify="center">
              <Text fontSize="sm">{userInfo.displayName ?? 'unknown'}</Text>
              <Text fontSize="xs">{userInfo.email ?? 'unknown'}</Text>
            </Flex>
          </Flex>
        </Box>
        <QuestionForm userInfo={userInfo} />
      </Flex>
      <VStack mt="2" gap="2">
        <MessageItem
          uid="uid"
          displayName="displayName"
          isOwner
          item={{
            id: 'id',
            message: 'message',
            createAt: '2023-03-31T21:19:00+09:00',
            author: {
              displayName: 'test',
              photoURL: null,
            },
          }}
        />
        <MessageItem
          uid="uid"
          displayName="displayName"
          isOwner={false}
          item={{
            id: 'id',
            message: 'message',
            createAt: '2023-03-31T21:19:00+09:00',
            author: {
              displayName: 'author',
              photoURL: null,
            },
            reply: 'reply',
            replyAt: '2023-03-31T21:30:00+09:00',
          }}
        />
      </VStack>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { screenName } = query;

  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
      },
    };
  }
  try {
    const screenNameStr = Array.isArray(screenName) ? screenName[0] : screenName;
    const protocol = process.env.PROTOCOL ?? 'http';
    const host = process.env.HOST ?? 'localhost';
    const port = process.env.PORT ?? '3000';
    const baseURL = `${protocol}://${host}:${port}`;
    const userInfoResp: AxiosResponse<InAuthUser> = await axios.get(`${baseURL}/api/user.info/${screenNameStr}`);
    return {
      props: {
        userInfo: userInfoResp.data,
      },
    };
  } catch (e) {
    return {
      props: {
        userInfo: null,
      },
    };
  }
};

export default UserHomePage;
