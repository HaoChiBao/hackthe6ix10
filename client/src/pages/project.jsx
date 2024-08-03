import Renderer from "../_components/renderer";
import { useParams } from "react-router-dom";

const Project = () => {
  const { projectId } = useParams();

  return <Renderer id={projectId} />;
};

export default Project;
