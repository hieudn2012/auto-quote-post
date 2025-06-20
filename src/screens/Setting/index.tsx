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
import { MultipleSelect } from "@/components/MultipleSelect";
import { useGetSettings } from "@/services/setting.service";

const shortenCaption = (caption: string) => {
  return caption.length > 30 ? caption.slice(0, 10) + "..." + caption.slice(-10) : caption
}

export default function Setting() {
  const { captions, media_folders, urls } = useGetSettings()
  const { values, handleChange, handleSubmit, setValues } = useFormik<SettingType>({
    initialValues: {
      working_directory: "",
      url: "",
      token: "",
      captions: [],
      profiles: [],
      media_folders: [],
      urls: [],
      groups: [],
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

  const addUrl = () => {
    setValues({
      ...values,
      urls: [...values.urls, { id: uuidv4(), label: "", value: "" }],
    });
  };

  const removeUrl = (id: string) => {
    setValues({
      ...values,
      urls: values.urls.filter((url) => url.id !== id),
    });
  };

  const addGroup = () => {
    setValues({
      ...values,
      groups: [...values.groups, { id: uuidv4(), caption_ids: [], media_folder_ids: [], url_ids: [], name: "" }],
    });
  };

  const removeGroup = (id: string) => {
    setValues({
      ...values,
      groups: values.groups.filter((group) => group.id !== id),
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
                    color="error"
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

                    <div className="flex-1">
                      <Input
                        name={`media_folders[${index}].name`}
                        value={folder.name}
                        onChange={handleChange}
                        label={`Name ${index + 1}`}
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
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
                    <div className="mt-5">
                      <Button
                        color="error"
                        type="button"
                        size="small"
                        icon="fas fa-trash"
                        onClick={() => removeMediaFolder(folder.id)}
                      />
                    </div>
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
          <Collapse title="URLs">
            <div className="flex flex-col gap-2">
              {map(values.urls, (url, index) => (
                <div key={url.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      name={`urls[${index}].label`}
                      value={url.label}
                      onChange={handleChange}
                      label="Label"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        name={`urls[${index}].value`}
                        value={url.value}
                        onChange={handleChange}
                        label="Value"
                      />
                    </div>
                    <div className="mt-4">
                      <Button
                        color="error"
                        type="button"
                        size="small"
                        icon="fas fa-trash"
                        onClick={() => removeUrl(url.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-start">
                <Button
                  type="button"
                  size="small"
                  icon="fas fa-plus"
                  onClick={addUrl}
                >
                  Add
                </Button>
              </div>
            </div>
          </Collapse>
          <Collapse title="Groups">
            <div className="flex flex-col gap-10">
              {map(values.groups, (group, index) => (
                <div key={group.id} className="w-full">
                  <div className="flex mb-2 w-full justify-between">
                    <p className="text-xl font-bold text-center text-gray-700">{group.name}</p>
                    <Button
                      color="error"
                      type="button"
                      size="small"
                      icon="fas fa-trash"
                      onClick={() => removeGroup(group.id)}
                    />
                  </div>
                  <div key={group.id} className="grid grid-cols-2 items-center gap-2">
                    <Input
                      name={`groups[${index}].name`}
                      value={group.name}
                      onChange={handleChange}
                      label="Name"
                    />
                    <MultipleSelect
                      label={`URLs`}
                      value={group.url_ids}
                      options={urls.map((url) => ({
                        label: url.label,
                        value: url.id,
                      }))}
                      onChange={(value) => {
                        setValues({
                          ...values,
                          groups: values.groups.map((group, i) => i === index ? { ...group, url_ids: value } : group),
                        })
                      }}
                    />
                    <MultipleSelect
                      label={`Captions`}
                      value={group.caption_ids}
                      options={captions.map((caption) => ({
                        label: shortenCaption(caption.caption),
                        value: caption.id,
                      }))}
                      onChange={(value) => {
                        setValues({
                          ...values,
                          groups: values.groups.map((group, i) => i === index ? { ...group, caption_ids: value } : group),
                        })
                      }}
                    />
                    <MultipleSelect
                      label={`Media Folders`}
                      value={group.media_folder_ids}
                      options={media_folders.map((folder) => ({
                        label: folder.name,
                        value: folder.id,
                      }))}
                      onChange={(value) => {
                        setValues({
                          ...values,
                          groups: values.groups.map((group, i) => i === index ? { ...group, media_folder_ids: value } : group),
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
                  onClick={addGroup}
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