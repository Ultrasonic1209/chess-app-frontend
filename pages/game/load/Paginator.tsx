import { MouseEventHandler } from "react";
import { Pagination } from "react-bootstrap";

export default function Paginator(page: string, setPage: MouseEventHandler<HTMLButtonElement>) {

    return <Pagination className="p-0 pt-3">
        <Pagination.First data-page={"1"} onClick={setPage} disabled={(page || "1") === "1"} />
        <Pagination.Prev data-page={(parseInt(page) || 2) - 1} onClick={setPage} disabled={(page || "1") === "1"} />
        <Pagination.Item active>{parseInt(page) || 1}</Pagination.Item>
        <Pagination.Next data-page={(parseInt(page) || 1) + 1} onClick={setPage} disabled={(parseInt(page) || 1) < 1} />
    </Pagination>
}