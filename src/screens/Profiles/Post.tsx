import Button from "@/components/Button";
import { windowInstance } from "@/types/window";
interface PostProps {
  ids: string[];
  showText?: boolean;
}

export default function Post({ ids, showText = true }: PostProps) {
  const handlePost = async () => {
    for (const id of ids) {
      windowInstance.api.runPost(id)
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }

  return (
    <Button
      color="info"
      icon="fa-solid fa-play"
      onClick={handlePost}
    >
      {showText ? 'Post' : ''}
    </Button>
  )
}