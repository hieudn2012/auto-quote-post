import { Layout } from "@/components/Layout";
import { Input } from "@/components/Input";
import { useFormik } from "formik";
import Button from "@/components/Button";
import TextArea from "@/components/TextArea";
import { Setting as SettingType, windowInstance } from "@/types/window";
import { useEffect } from "react";
import { map } from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { Collapse } from "./Collapse";
import { FolderInput } from "@/components/FolderInput";
import { toast } from "react-toastify";

export default function Setting() {
  const { values, handleChange, handleSubmit, setValues } = useFormik<SettingType>({
    initialValues: {
      working_directory: "",
      url: "",
      token: "",
      captions: [],
      profiles: [],
      media_folders: [],
    },
    onSubmit: (values) => {
      localStorage.setItem("settings", JSON.stringify(values))
      windowInstance.api.saveSettings(values)
      toast.success("Settings saved")
    },
  });

  const addCaption = () => {
    setValues({
      ...values,
      captions: [...values.captions, {
        id: uuidv4(),
        label: "",
        caption: "",
      }],
    });
  };

  const removeCaption = (id: string) => {
    setValues({
      ...values,
      captions: values.captions.filter((caption) => caption.id !== id),
    });
  };

  const addMediaFolder = () => {
    console.log(values.media_folders, 'values.media_folders')

    setValues({
      ...values,
      media_folders: [...values.media_folders, { id: uuidv4(), name: "", path: "" }],
    });
  };

  const removeMediaFolder = (id: string) => {
    setValues({
      ...values,
      media_folders: values.media_folders.filter((folder) => folder.id !== id),
    });
  };
  useEffect(() => {
    windowInstance.api.getSettings().then((settings) => {
      setValues(settings)
    })
  }, [setValues])

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <Collapse title="Global Settings">
            <div className="grid grid-cols-1 gap-4">
              <Input
                name="token"
                value={values.token}
                onChange={handleChange}
                label="Token"
                placeholder="Makueaxgfnjhweyd7sjhaw"
              />
              <Input
                name="url"
                value={values.url}
                onChange={handleChange}
                label="URL"
                placeholder="https://threads.net"
              />
              {/* <Input
                name="working_directory"
                value={values.working_directory}
                onChange={handleChange}
                label="Working Directory"
                placeholder="/Users/admin/Desktop/Threads"
              /> */}
            </div>
          </Collapse>
          <Collapse title="Captions">
            <div className="flex flex-col gap-2">
              {map(values.captions, (caption, index) => (
                <div key={caption.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextArea
                      name={`captions[${index}].caption`}
                      value={caption.caption}
                      onChange={handleChange}
                      label={`Caption ${index + 1}`}
                    />
                  </div>
                  <Button
                    type="button"
                    size="small"
                    icon="fas fa-trash"
                    onClick={() => removeCaption(caption.id)}
                  />
                </div>
              ))}
              <div className="flex justify-start">
                <Button
                  type="button"
                  size="small"
                  icon="fas fa-plus"
                  onClick={addCaption}
                >
                  Add
                </Button>
              </div>
            </div>
          </Collapse>
          <Collapse title="Media Folders">
            <div className="flex flex-col gap-2">
              {map(values.media_folders, (folder, index) => (
                <div key={folder.id} className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2">
                    <div className="mt-4">
                      <Button
                        color="error"
                        type="button"
                        size="small"
                        icon="fas fa-trash"
                        onClick={() => removeMediaFolder(folder.id)}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        name={`media_folders[${index}].name`}
                        value={folder.name}
                        onChange={handleChange}
                        label={`Name ${index + 1}`}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <FolderInput
                      name={`media_folders[${index}].path`}
                      value={folder.path}
                      label={`Path ${index + 1}`}
                      onChange={(value) => {
                        setValues({
                          ...values,
                          media_folders: values.media_folders.map((folder, i) => i === index ? { ...folder, path: value } : folder),
                        })
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-start">
                <Button
                  type="button"
                  size="small"
                  icon="fas fa-plus"
                  onClick={addMediaFolder}
                >
                  Add
                </Button>
              </div>
            </div>
          </Collapse>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" size="medium" icon="fas fa-save">Save</Button>
        </div>
      </form>
    </Layout >
  );
}