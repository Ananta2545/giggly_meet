"use client"

import { getSession, useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const page = () => {
    const params = useParams();
    const roomId = params.roomId;
    const { data: session, status } = useSession();
    const router = useRouter();
    const containerRef = useRef(null);
    const [zp, setZp] = useState(null);
    const [isInMeeting, setIsInMeeting] = useState(false);
    const hasJoinedRef = useRef(false);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.name && containerRef.current && !hasJoinedRef.current) {
            console.log("Session is authenticated. Meeting is joining");
            joinMeeting(containerRef.current);
            hasJoinedRef.current = true;
        }
    }, [status, session]);
    
    

    useEffect(() => {
        return () => {
            if (zp && typeof zp.destroy === 'function') {
                zp.destroy();
            }
        };
    }, [zp]);
    

    const joinMeeting = async (element) => {
        const appID = Number(process.env.NEXT_PUBLIC_ZEGOAPP_ID);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
        if (!appID && !serverSecret) {
            throw new Error('Please provide appId and server secret');
        }
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, session?.user?.id || Date.now().toString(), session?.user?.name || "Guest");

        const zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
        setZp(zegoInstance);

        zegoInstance.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'join via this link',
                    url: `${window.location.origin}/video-meeting/${roomId}`
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall,
            },
            showAudioVideoSettingsButton: true,
            showScreenSharingButton: true,
            showTurnOffRemoteCameraButton: true,
            showTurnOffRemoteMicrophoneButton: true,
            showRemoveUserButton: true,
            onJoinRoom: () => {
                toast.success("Meeting joined successfully")
                setIsInMeeting(true);
            },
            onLeaveRoom: () => {
                endMeeting();
            }
        });
    }

    const endMeeting = () => {
        try {
            console.log("Navigating to home without destroying Zego instance.");
            // router.push('/')
        } catch (err) {
            console.warn("Error during meeting end:", err);
        } finally {
            setIsInMeeting(false);
            toast.success("Meeting Ended");
            router.push('/'); // Navigate to homepage
        }
    };
    
    

    return (
        <div className='flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900'>
            <div className={`flex-grow flex flex-col md:flex-row relative ${isInMeeting ? 'h-screen' : ''}`}>
                <div ref={containerRef} className='video-container flex-grow' style={{ height: isInMeeting ? '100vh' : 'calc(100vh - 4rem)' }}>
                </div>
            </div>

            {!isInMeeting && (
                <div className='flex flex-col overflow-y-auto'>
                    <div className='p-6'>
                        <h2 className='text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white'>
                            Meeting Info
                        </h2>
                        <p className='text-center text-sm mb-4 text-gray-600 dark:text-gray-300'>
                            Participant - {session?.user?.name}
                        </p>
                        <Button onClick={endMeeting} className='cursor-pointer w-full bg-red-500 hover:bg-red-200 text-white hover:text-black'>
                            End Meeting
                        </Button>
                    </div>

                    {/* Make this section scrollable if content exceeds screen height */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-200 dark:bg-gray-800 overflow-y-auto max-h-[calc(100vh-250px)]'>
                        <div className='text-center'>
                            <Image
                                src='/images/videoQuality.jpg'
                                alt='feature_1'
                                width={150}
                                height={150}
                                className='mx-auto mb-2 rounded-full'
                            />
                            <h3 className='text-lg font-semibold mb-1 text-gray-800 dark:text-white'>
                                HD Video Quality
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-300'>Experience crystal clear video calls</p>
                        </div>
                        <div className='text-center'>
                            <Image
                                src='/images/screenShare.jpg'
                                alt='feature_2'
                                width={150}
                                height={150}
                                className='mx-auto mb-2 rounded-full'
                            />
                            <h3 className='text-lg font-semibold mb-1 text-gray-800 dark:text-white'>
                                Screen Sharing
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-300'>Easily share your screen with participants</p>
                        </div>
                        <div className='text-center'>
                            <Image
                                src='/images/videoSecure.jpg'
                                alt='feature_3'
                                width={150}
                                height={150}
                                className='mx-auto mb-2 rounded-full'
                            />
                            <h3 className='text-lg font-semibold mb-1 text-gray-800 dark:text-white'>
                                Secure Meetings
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-300'>Your meetings are protected and private</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default page;
