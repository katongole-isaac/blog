import { Button } from "@/components/ui/button";

const AppEditorActions = () => {
  const handlePostBlog = () => {};

  const handleSavedAsDraft = () => {};

  return (
    <div className="w-full py-5 px-4 flex gap-2 justify-end">
      <Button variant="outline" size="sm">
        Saved as Draft
      </Button>
      <Button variant="outline" size="sm">
        post
      </Button>
    </div>
  );
};

export default AppEditorActions;
