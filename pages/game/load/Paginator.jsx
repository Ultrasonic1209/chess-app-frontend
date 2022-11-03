import { Pagination } from "react-bootstrap";

export default function Paginator(page, setPage) {
    <Pagination className="p-0 pt-3">
    <Pagination.First data-page={"1"} onClick={setPage} disabled={(page || "1") === "1"} />
    <Pagination.Prev data-page={(parseInt(page) || 2) - 1} onClick={setPage} disabled={(page || "1") === "1"} />
    <Pagination.Item active hr>{parseInt(page) || 1}</Pagination.Item>
    <Pagination.Next data-page={(parseInt(page) || 1) + 1} onClick={setPage} disabled={setPage < 1} />
  </Pagination>
}