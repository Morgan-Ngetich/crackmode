import { Flex, Box, Text, Button } from "@chakra-ui/react";

const NotFound = () => {
  return (
    <Flex
      justify="center"
      align="center"
      height="100vh"
      px={4}
      textAlign="center"
    >
      <Box>
        <Box>
          <Text fontSize="4xl" fontWeight="bold" mb={2} color={"orange"}>
            Coming Soon!
          </Text>
          <Text fontSize="md" mb={6}>
            This page is under development and will be available soon.
          </Text>
        </Box>

        <Button
          onClick={() => history.back()}
        >
          Go Back
        </Button>

      </Box>
    </Flex>
  );
};

export default NotFound;