import { useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Modal,
  Row,
  Upload,
  message,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import enUS from "antd/lib/locale/en_US";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { callCreateResume, callUploadSingleFile } from "@/config/api";
import { useState } from "react";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  jobDetail: IJob | null;
}

const ApplyModal = (props: IProps) => {
  const { isModalOpen, setIsModalOpen, jobDetail } = props;
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);
  // const [urlCV, setUrlCV] = useState<string>("");
  const [fileUploadInput, setFlieUploadInput] = useState<File>();
  const navigate = useNavigate();

  const handleOkButton = async () => {
    if (!isAuthenticated) {
      setIsModalOpen(false);
      navigate(`/login?callback=${window.location.href}`);
    } else {
      //todo
      if (jobDetail) {
        const res = await callCreateResume(
          //   urlCV,
          jobDetail?.company?._id,
          jobDetail?._id
        );
        if (res.data) {
          try {
            const res = await callUploadSingleFile(
              fileUploadInput,
              "resume",
              jobDetail?._id ?? ""
            );
            if (res && res.data) {
              // setUrlCV(res.data.fileName);
              message.success("Nộp CV thành công!");
              // if (onSuccess) onSuccess("ok");
            }
            if (res && res.error) {
              notification.error({
                message: "Có lỗi xảy ra",
                description: res.message,
              });
            }
          } catch (error) {
            // setUrlCV("");
            alert("eror");
          } finally {
            if (!fileUploadInput && isAuthenticated) {
              message.error("Vui lòng upload CV!");
              return;
            }
            setIsModalOpen(false);
          }
        } else {
          notification.error({
            message: "Có lỗi xảy ra",
            description: res.message,
          });
        }
      }
    }
  };

  const propsUpload: UploadProps = {
    maxCount: 1,
    multiple: false,
    accept: "application/pdf, .pdf",
    async customRequest({ file, onSuccess, onError }: any) {
      setFlieUploadInput(file);
      //   const res = await callUploadSingleFile(file, "resume");
      //   if (res && res.data) {
      //     setUrlCV(res.data.fileName);
      //     // if (onSuccess) onSuccess("ok");
      //   } else {
      //     if (onError) {
      //       setUrlCV("");
      //       const error = new Error(res.message);
      //       //   onError({ event: error });
      //     }
      //   }
    },
    onChange(info) {
      // info.file.status = "done";
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file đã sẵn sàng để upload`);
      } else if (info.file.status === "error") {
        message.error(
          info?.file?.error?.event?.message ??
            "Đã có lỗi xảy ra với file upload."
        );
      }
    },
  };

  return (
    <>
      <Modal
        title="Ứng Tuyển Job"
        open={isModalOpen}
        onOk={() => handleOkButton()}
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        okText={isAuthenticated ? "Nộp CV " : "Đăng Nhập"}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose={true}
      >
        <Divider />
        {isAuthenticated ? (
          <div>
            <ConfigProvider locale={enUS}>
              <ProForm
                submitter={{
                  render: () => <></>,
                }}
              >
                <Row gutter={[10, 10]}>
                  <Col span={24}>
                    <div>
                      Bạn đang ứng tuyển công việc <b>{jobDetail?.name} </b>tại{" "}
                      <b>{jobDetail?.company?.name}</b>
                    </div>
                  </Col>
                  <Col span={24}>
                    <ProFormText
                      fieldProps={{
                        type: "email",
                      }}
                      label="Email"
                      name={"email"}
                      labelAlign="right"
                      disabled
                      initialValue={user?.email}
                    />
                  </Col>
                  <Col span={24}>
                    <ProForm.Item
                      label={"Upload file CV"}
                      rules={[
                        { required: true, message: "Vui lòng upload file!" },
                      ]}
                    >
                      <Upload {...propsUpload}>
                        <Button icon={<UploadOutlined />}>
                          Tải lên CV của bạn ( Hỗ trợ .pdf, and &lt; 5MB )
                        </Button>
                      </Upload>
                    </ProForm.Item>
                  </Col>
                </Row>
              </ProForm>
            </ConfigProvider>
          </div>
        ) : (
          <div>
            Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể "Nộp CV"
            bạn nhé -.-
          </div>
        )}
        <Divider />
      </Modal>
    </>
  );
};
export default ApplyModal;
