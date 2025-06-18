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

export default function Setting() {
  const { values, handleChange, handleSubmit, setValues } = useFormik<SettingType>({
    initialValues: {
      working_directory: "",
      token: "",
      captions: [],
      profiles: [],
    },
    onSubmit: (values) => {
      localStorage.setItem("settings", JSON.stringify(values))
      windowInstance.api.saveSettings(values)
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
                name="working_directory"
                value={values.working_directory}
                onChange={handleChange}
                label="Working Directory"
                placeholder="/Users/admin/Desktop/Threads"
              />
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
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" size="medium" icon="fas fa-save">Save</Button>
        </div>
      </form>
    </Layout >
  );
}