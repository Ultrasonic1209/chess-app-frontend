import { MouseEventHandler } from "react";
import { Pagination } from "react-bootstrap";

export class PaginatorParams {
    page: string;
    setPage: MouseEventHandler<HTMLButtonElement>
}

export default function Paginator({page, setPage}: PaginatorParams) {

    return <Pagination className="p-0 pt-3">
        <Pagination.First data-page={"1"} onClick={setPage} disabled={(page || "1") === "1"} />
        <Pagination.Prev data-page={(parseInt(page) || 2) - 1} onClick={setPage} disabled={(page || "1") === "1"} />
        <Pagination.Item active>{parseInt(page) || 1}</Pagination.Item>
        <Pagination.Next data-page={(parseInt(page) || 1) + 1} onClick={setPage} disabled={(parseInt(page) || 1) < 1} />
    </Pagination>
}