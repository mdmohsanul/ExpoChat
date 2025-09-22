import React from 'react'
import {Heading,Html,Head,Preview,Row,Section,Text} from "@react-email/components"

interface VerificationEmailProps {
    username:string;
    otp:string
}

const VerificationEmail = ({username,otp}:VerificationEmailProps) => {
  return (
   <Html lang='en' dir='ltr'>
    <Head>
        <title>Verification Code</title>
    </Head>
     <Preview>Here&apos;s your verification code: {otp}</Preview>
     <Section>
      <Row>
        <Heading as='h2'>Hello {username}</Heading>
      </Row>
      <Row>
        <Text>
          Thank you for registering, Please use the following verification code to complete your verification.
        </Text>
      </Row>
      <Row>
        <Text>{otp}</Text>
      </Row>
      <Row>
        <Text>
          If you did not request this code, please ignore this email.
        </Text>
      </Row>
     </Section>
   </Html>
  )
}

export default VerificationEmail