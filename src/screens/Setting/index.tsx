import { Layout } from "@/components/Layout";
import { Input } from "@/components/Input";
import { useFormik } from "formik";
import Button from "@/components/Button";
import TextArea from "@/components/TextArea";
import { Setting as SettingType, windowInstance } from "@/types/window";
import { useEffect } from "react";
import { map } from "lodash";

export default function Setting() {
  const { values, handleChange, handleSubmit, setValues } = useFormik<SettingType>({
    initialValues: {
      working_directory: "",
      token: "",
      captions: [
        "This is a caption",
        "This is another caption",
      ],
    },
    onSubmit: (values) => {
      localStorage.setItem("settings", JSON.stringify(values))
      windowInstance.api.saveSettings(values)
    },
  });

  const addCaption = () => {
    setValues({
      ...values,
      captions: [...values.captions, ""],
    });
  };

  const removeCaption = (index: number) => {
    setValues({
      ...values,
      captions: values.captions.filter((_, i) => i !== index),
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
          <div className="grid grid-cols-2 gap-4">
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
          <div className="flex flex-col gap-2">
            {map(values.captions, (caption, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <TextArea
                    name={`captions[${index}]`}
                    value={caption}
                    onChange={handleChange}
                    label={`Caption ${index + 1}`}
                    placeholder={`Caption ${index + 1}`}
                  />
                </div>
                <Button
                  type="button"
                  size="small"
                  icon="fas fa-trash"
                  onClick={() => removeCaption(index)}
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
          <div className="flex justify-end">
            <Button type="submit" size="medium" icon="fas fa-save">Save</Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}