import { Button, Col, Form, Row, Select } from "antd";
import {
  DownOutlined,
  EnvironmentOutlined,
  MonitorOutlined,
} from "@ant-design/icons";
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils";
import { ProForm } from "@ant-design/pro-components";
import { useState } from "react";

const SearchClient = () => {
  const optionsSkills = SKILLS_LIST;
  const optionsLocations = LOCATION_LIST;
  const [form] = Form.useForm();
  const [locationSelected, setLocationSelected] = useState<String>("");

  const onFinish = async (values: any) => {};
  const searchJobFunction = () => {
    console.log("searchJobFunction");
  };
  return (
    <ProForm
      form={form}
      onFinish={onFinish}
      submitter={{
        render: () => <></>,
      }}
    >
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <h2>Việc Làm IT Cho Developer</h2>
        </Col>
        <Col span={24} md={16}>
          <ProForm.Item name="skills">
            <Select
              mode="multiple"
              allowClear
              showArrow={false}
              style={{ width: "100%" }}
              placeholder={
                <>
                  <MonitorOutlined /> Tìm theo kỹ năng...
                </>
              }
              optionLabelProp="label"
              options={optionsSkills}
            />
          </ProForm.Item>
        </Col>
        <Col span={12} md={4}>
          <ProForm.Item name="location">
            <Select
              mode="multiple"
              allowClear
              //   showArrow={false}
              suffixIcon=<DownOutlined />
              style={{ width: "100%" }}
              placeholder={
                <>
                  <EnvironmentOutlined /> Địa điểm...
                </>
              }
              optionLabelProp="label"
              options={optionsLocations}
              onChange={(e) => setLocationSelected(e.target.value)}
            />
          </ProForm.Item>
        </Col>
        <Col span={12} md={4}>
          <Button type="primary" onClick={() => searchJobFunction()}>
            Search
          </Button>
        </Col>
      </Row>
    </ProForm>
  );
};
export default SearchClient;
