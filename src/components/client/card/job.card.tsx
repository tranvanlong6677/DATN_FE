import {
  LOCATION_LIST,
  convertSlug,
  formatDateFunction,
  getLocationName,
} from "@/config/utils";
import { IJob } from "@/types/backend";
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Card, Col, Empty, Pagination, Row, Spin } from "antd";
import { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import styles from "styles/client.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchJob, searchJob } from "@/redux/slice/jobSlide";
import "dayjs/locale/en";

dayjs.extend(relativeTime);
dayjs.locale("en");
interface IProps {
  showPagination?: boolean;
}

const JobCard = (props: IProps) => {
  const { showPagination = false } = props;
  const displayJob = useAppSelector((state) => state.job.result);
  const meta = useAppSelector((state) => state.job.meta);

  const dispatch = useAppDispatch();
  //   const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem("isSearching", "false");
    localStorage.setItem("dataSearching", "");
  }, []);

  useEffect(() => {
    setCurrent(1);
  }, [
    localStorage.getItem("isSearching"),
    localStorage.getItem("dataSearching"),
  ]);
  useEffect(() => {
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    if (
      localStorage.getItem("isSearching") === "true" &&
      localStorage.getItem("dataSearching")
    ) {
      if (!JSON.parse(localStorage.getItem("dataSearching") as string).salary) {
        dispatch(
          searchJob({
            values: {
              ...JSON.parse(localStorage.getItem("dataSearching") as string),
              salary: "-1",
            } as {
              skills: string[];
              location: string[];
              salary: string;
              level: string;
            },
            query,
          })
        );
      } else {
        dispatch(
          searchJob({
            values: {
              ...JSON.parse(localStorage.getItem("dataSearching") as string),
            } as {
              skills: string[];
              location: string[];
              salary: string;
              level: string;
            },
            query,
          })
        );
      }
    } else {
      dispatch(fetchJob({ query }));
    }
  }, [current, pageSize, filter, sortQuery]);

  const handleOnchangePage = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const handleViewDetailJob = (item: IJob) => {
    const slug = convertSlug(item.name);
    navigate(`/job/${slug}?id=${item._id}`);
  };

  return (
    <div className={`${styles["card-job-section"]}`} lang="en">
      <div className={`${styles["job-content"]}`}>
        <Spin spinning={isLoading} tip="Loading...">
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <div
                className={
                  isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]
                }
              >
                <span className={styles["title"]}>
                  {localStorage.getItem("isSearching") === "true"
                    ? "Kết quả tìm kiếm"
                    : "Công Việc Mới Nhất"}
                </span>
                {!showPagination && <Link to="job">Xem tất cả</Link>}
              </div>
            </Col>

            {displayJob?.map((item) => {
              return (
                <Col span={24} md={12} key={item._id}>
                  <Card
                    size="small"
                    title={null}
                    hoverable
                    onClick={() => handleViewDetailJob(item)}
                  >
                    <div className={styles["card-job-content"]}>
                      <div className={styles["card-job-left"]}>
                        <img
                          alt="example"
                          src={
                            item?.company?.logo?.includes("http:")
                              ? item?.company?.logo
                              : `${
                                  import.meta.env.VITE_BACKEND_URL
                                }/images/company/${item?.company?.logo}`
                          }
                        />
                      </div>
                      <div className={styles["card-job-right"]}>
                        <div className={styles["job-title"]}>{item.name}</div>
                        <div className={styles["job-location"]}>
                          <EnvironmentOutlined style={{ color: "#58aaab" }} />
                          &nbsp;{getLocationName(item.location)}
                        </div>
                        <div>
                          <ThunderboltOutlined style={{ color: "orange" }} />
                          &nbsp;
                          {(item.salary + "")?.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ","
                          )}{" "}
                          đ
                        </div>
                        <div className={styles["job-updatedAt"]}>
                          Từ {formatDateFunction(item.updatedAt)}
                          {/* {dayjs(item.updatedAt).fromNow()} */}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}

            {(!displayJob || (displayJob && displayJob.length === 0)) &&
              !isLoading && (
                <div className={styles["empty"]}>
                  <Empty description="Không có dữ liệu" />
                </div>
              )}
          </Row>
          {showPagination && (
            <>
              <div style={{ marginTop: 30 }}></div>
              <Row style={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  current={current}
                  total={meta.total}
                  pageSize={pageSize}
                  responsive
                  onChange={(p: number, s: number) =>
                    handleOnchangePage({ current: p, pageSize: s })
                  }
                />
              </Row>
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default JobCard;
