import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenuContent, DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Copy, Link2, LinkIcon, Video } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Loader from './Loader';

const MeetingActions = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [generatedMeetingUrl, setGeneratedMeetingUrl] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  const router = useRouter();

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const handleCreateMeetingForLater = () => {
    const roomId = uuidv4();
    const url = `${baseUrl}/video-meeting/${roomId}`;
    setGeneratedMeetingUrl(url);
    setIsDialogOpen(true);
    toast.success('Meeting link created successfully');
  };

  const handleStartMeeting = () => {
    setIsLoading(true);
    const roomId = uuidv4();
    const url = `${baseUrl}/video-meeting/${roomId}`;
    router.push(url);
    toast.success('Joining meeting...');
  };

  const handleJoinMeeting = () => {
    if (meetingLink) {
      setIsLoading(true);
      const formattedLink = meetingLink.includes('http') ? meetingLink : `${baseUrl}/video-meeting/${meetingLink}`;
      router.push(formattedLink);
      toast.info('Joining meeting...');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMeetingUrl);
    toast.info('Meeting link copied to clipboard');
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in">
        {/* Dropdown for New Meeting */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="cursor-pointer w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-purple-300/30 transition-all duration-300 ease-in-out"
              size="lg"
            >
              <Video className="w-5 h-5 mr-2" />
              New meeting
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white dark:bg-gray-800 shadow-lg rounded-md">
            <DropdownMenuItem onClick={handleCreateMeetingForLater} className="cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-700">
              <Link2 className="w-4 h-4 mr-2 text-purple-600" />
              Create a meeting for later
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStartMeeting} className="cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-700">
              <Link2 className="w-4 h-4 mr-2 text-purple-600" />
              Start an instant meeting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Input to Join Meeting */}
        <div className="flex w-full sm:w-auto relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <LinkIcon className="w-4 h-4 text-gray-400" />
          </span>
          <Input
            placeholder="Enter a code or link"
            className="pl-10 pr-12 py-2 rounded-l-md bg-white/30 dark:bg-gray-800/40 backdrop-blur border border-purple-300 focus:border-purple-500 transition duration-300 ease-in-out text-gray-900 dark:text-white"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />
          <Button
            onClick={handleJoinMeeting}
            variant="secondary"
            className="cursor-pointer ml-2 rounded-r-md bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white transition-all duration-300 ease-in-out"
          >
            Join
          </Button>
        </div>
      </div>

      {/* Dialog for generated meeting link */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm rounded-lg p-6 bg-white dark:bg-gray-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-semibold text-purple-700 dark:text-purple-400">
              Here's your joining info
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Send this to your people! And yep, save it for yourself too—you'll thank yourself later.
            </p>
            <div className="flex items-center justify-between bg-purple-50 dark:bg-gray-800 p-4 rounded-lg">
              <span className="text-sm font-medium text-purple-700 dark:text-gray-200 break-all">
                {generatedMeetingUrl.slice(0, 30)}...
              </span>
              <Button
                className="cursor-pointer hover:bg-purple-200 dark:hover:bg-gray-700 transition"
                onClick={copyToClipboard}
              >
                <Copy className="w-5 h-5 text-purple-500" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MeetingActions;
