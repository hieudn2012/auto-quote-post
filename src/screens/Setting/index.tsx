import { Layout } from "@/components/Layout";
import { Input } from "@/components/Input";
import { useFormik } from "formik";
import Button from "@/components/Button";

export default function Setting() {
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      working_directory: "",
      token: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <Input
            name="working_directory"
            value={values.working_directory}
            onChange={handleChange}
            label="Working Directory"
            placeholder="/Users/admin/Desktop/Threads"
          />
          <Input
            name="token"
            value={values.token}
            onChange={handleChange}
            label="Token"
            type="password"
            placeholder="Makueaxgfnjhweyd7sjhaw"
          />
          <div className="flex justify-end">
            <Button type="submit" size="medium" icon="fas fa-save">Save</Button>
          </div>
        </div>
      </form>
    </Layout>
  )
}