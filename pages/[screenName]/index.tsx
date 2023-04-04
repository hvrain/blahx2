/* eslint-disable no-restricted-syntax */
import { GetServerSideProps, NextPage } from 'next';
import { Avatar, Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import ServiceLayout from '@/components/service_layout';
import QuestionForm from '@/components/question_form';
import { InAuthUser } from '@/models/in_auth_user';
import MessageItem from '@/components/message_item';
import BadReqErr from '@/controllers/error/bad_request';
import { InMessage } from '@/models/message/in_message';
import { useAuth } from '@/contexts/auth_user.context';

type Props = {
  userInfo: InAuthUser | null;
};

const BROKEN_LINK = 'https://bit.ly/broken-link';

const UserHomePage: NextPage<Props> = function ({ userInfo }) {
  const { authUser } = useAuth();
  const [messageList, setMessageList] = useState<InMessage[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [messageListfetchTrigger, setMessageListfetchTrigger] = useState(true);

  async function fetchMessageList(uid: string) {
    try {
      const resp = await fetch(`/api/message.list?uid=${uid}&page=${page}&size=3`);
      if (resp.status !== 200) {
        throw new BadReqErr('메세지 목록 조회에 실패했습니다.');
      }
      const list = (await resp.json()) as {
        data: InMessage[];
        totalPages: number;
        page: number;
        size: number;
        totalElements: number;
      };
      setMessageList((p) => {
        const arr = [...list.data, ...p];
        const map = new Map();
        for (const msg of arr) {
          map.set(msg.messageNo, msg);
        }
        return [...map.values()].sort((a, b) => b.messageNo - a.messageNo);
      });
      setTotalPages(list.totalPages);
      console.log(messageList);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchMessageInfo(uid: string, messageId: string) {
    try {
      const resp = await fetch(`/api/message.info?uid=${uid}&messageId=${messageId}`);
      if (resp.status !== 200) {
        throw new BadReqErr('메세지 목록 조회에 실패했습니다.');
      }
      const data = (await resp.json()) as InMessage;
      setMessageList((prev) => {
        const index = prev.findIndex(({ id }) => id === data.id);
        if (index >= 0) {
          const updateList = [...prev];
          updateList[index] = data;
          return updateList;
        }
        return prev;
      });
      console.log(messageList);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (userInfo === null) return;
    fetchMessageList(userInfo.uid);
  }, [userInfo, messageListfetchTrigger, page]);

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
        <QuestionForm userInfo={userInfo} onSendSuccess={() => setMessageListfetchTrigger((p) => !p)} />
      </Flex>
      <VStack mt="2" gap="2">
        {messageList.map((message) => (
          <MessageItem
            key={`${userInfo.uid}-${message.id}`}
            uid={userInfo.uid}
            displayName={message.author?.displayName ?? '익명'}
            photoURL={userInfo.photoURL ?? ''}
            isOwner={authUser?.uid === userInfo.uid}
            item={message}
            onSendSuccess={async () => {
              fetchMessageInfo(userInfo.uid, message.id);
            }}
          />
        ))}
        {totalPages > page && (
          <Button
            w="full"
            fontSize="sm"
            bgColor="gray.300"
            leftIcon={<TriangleDownIcon />}
            onClick={() => {
              setPage((p) => p + 1);
            }}
          >
            더보기
          </Button>
        )}
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
