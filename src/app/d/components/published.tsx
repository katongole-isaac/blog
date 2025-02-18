"use client";

import _ from "lodash";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toast } from "react-hot-toast";

import utils from "@/utils";
import ErrorToast from "./errorToast";
import config from "@/config/default.json";
import { Checkbox } from "@/components/ui/checkbox";
import TableActions from "@/app/d/components/tableAction";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import BlogTable, { ITableColum } from "@/app/d/components/table";
import { clearBlogDeletingError, deleteBlogs, fetchBlogs, getAllBlogsState, getBlogDeletingState } from "@/store/blogSlice";

export interface IBlogTable {
  title: string;
  blogURL: string;
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
  /**Used in drafts */
  filename?: string;
}

const DeleteBlogAlert = dynamic(() => import("./deleteAlert"), { ssr: false });
const ProgressBar = dynamic(() => import("@/components/common/progressBar"), { ssr: false });

const PublishedBlogs = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data: blogs, isLoading } = useAppSelector(getAllBlogsState);
  const { error: deletingError } = useAppSelector(getBlogDeletingState);

  const [singleBlogToDelete, setSingleBlogToDelete] = useState<IBlogTable | null>(null);
  const [_selectedItems, setSelectedItems] = useState(new Set<string>());
  const [paginated, setPaginated] = useState<any[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState({
    all: false,
    single: false,
  });

  const mappedData: IBlogTable[] = blogs
    ? blogs.map((blog: any) => {
        const _url = blog.pathname.split("/")[1].replace(".md", "");
        const blogURL = `${config.blogBaseURL}/${_url}`;

        return {
          ...blog,
          title: _url,
          blogURL,
        };
      })
    : [];

  const tableData = _.uniqBy(mappedData, "pathname");

  const handleDeleteAll = () => {
    if (selectedItems.every((item): item is IBlogTable => item !== undefined)) {
      const urls = selectedItems.map((item) => item.url);

      dispatch(deleteBlogs(urls));

      setShowDeleteAlert({ all: false, single: false });

      setSelectedItems(new Set());
    }
  };

  const handleBlogDelete = () => {
    if (!singleBlogToDelete) return;

    const { url } = singleBlogToDelete;

    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      newSelected.has(url) ? newSelected.delete(url) : null;
      return newSelected;
    });

    dispatch(deleteBlogs([url]));

    setShowDeleteAlert({ all: false, single: false });
  };

  const handleBlogEdit = (blog: IBlogTable) => {
    const editURL = "/d/edit?blogId=" + blog.pathname.replace(".md", "");
    router.push(editURL);
  };

  // For a single delete operation
  const openDeleteAlert = (item: IBlogTable) => {
    setShowDeleteAlert({ all: false, single: true });
    setSingleBlogToDelete(item);
  };

  const onDeleteAlertClose = () => {
    setShowDeleteAlert({ all: false, single: false });

    setTimeout(() => {
      // this is executed in the setTimeout
      // to avoid unecessary UI shits
      setSingleBlogToDelete(null);
    }, 1000);
  };

  const handleSelectAll = () => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      isAllSelected ? paginated.forEach((item) => newSelected.delete(item.url)) : paginated.forEach((item) => newSelected.add(item.url));
      return newSelected;
    });
  };

  const _isItemSelected = (item: any) => _selectedItems.has(item.url);
  const isAllSelected = paginated.every(_isItemSelected);

  const handleSelectItem = (item: any) => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      _isItemSelected(item) ? newSelected.delete(item.url) : newSelected.add(item.url);
      return newSelected;
    });
  };

  const columns: ITableColum[] = [
    {
      title: "",
      content: (item) =>
        item ? (
          <Checkbox checked={_isItemSelected(item)} onClick={() => handleSelectItem(item)} />
        ) : (
          <Checkbox onClick={handleSelectAll} checked={isAllSelected} />
        ),
      className: "w-11",
    },
    {
      title: "Blog Title",
      path: "title",

      content: (item) => (item ? <span className="line-clamp-1 text-ellipsis pl-0"> {item?.title}</span> : null),
    },
    {
      title: "Blog URL ",
      path: "blogURL",
      content: (item) =>
        item ? (
          <Link className="text-blue-500 line-clamp-1 text-ellipsis pl-0" target="_blank" href={item.blogURL}>
            {item.title}
          </Link>
        ) : null,
    },
    {
      title: "Published Date",
      path: "uploadedAt",
      content: (item) => (item ? <span className="line-clamp-1 text-ellipsis"> {utils.blogTimeFormat(item?.uploadedAt)} </span> : null),
      className: "w-48",
    },
    {
      title: "",
      content: (item) => (item ? <TableActions item={item} onDelete={openDeleteAlert} onEdit={handleBlogEdit} /> : null),
    },
  ];

  const selectedItems = Array.from(_selectedItems).map((s) => tableData.find((d) => d.url === s));

  const isSelected = (selected: any[], item: any) => _.some(selected, { url: item.url });

  const { all, single } = showDeleteAlert;

  useEffect(() => {
    dispatch(fetchBlogs());
  }, []);

  useEffect(() => {
    if (deletingError.message) {
      setTimeout(() => {
        dispatch(clearBlogDeletingError());
      }, 5_000);
      toast.custom((t: Toast) => <ErrorToast t={t} message={deletingError.message} />, { id: "deleting-error", duration: 4500 });
    }
  }, [deletingError.message]);

  return (
    <div className="px-5 md:px-0">
      {isLoading && tableData && <ProgressBar />}
      <DeleteBlogAlert itemsToBeDeleted={selectedItems.length} onContinue={handleDeleteAll} onClose={onDeleteAlertClose} open={all}>
        <div className="max-h-72 border- overflow-y-auto">
          <ul className="flex-col gap-2 pr-2 !relative "></ul>
          {selectedItems.map((item) =>
            item ? (
              <li key={item?.blogURL} className="line-clamp-1 text-ellipsis pl-4">
                <Link href={item?.blogURL || ""} target="_blank" className="text-blue-600 hover:underline">
                  {item!.title}
                </Link>
              </li>
            ) : null
          )}
        </div>
      </DeleteBlogAlert>
      <DeleteBlogAlert
        title="Are you sure you want to delete this blog post? "
        description="This action cannot be undone. This will permanently delete this blog post and remove data from the servers."
        itemsToBeDeleted={[singleBlogToDelete].length}
        onContinue={handleBlogDelete}
        onClose={onDeleteAlertClose}
        open={single}
      >
        {singleBlogToDelete && (
          <Link href={singleBlogToDelete.blogURL || ""} target="_blank" className="text-blue-600 hover:underline line-clamp-1 text-ellipsis w-max">
            {singleBlogToDelete.title}
          </Link>
        )}
      </DeleteBlogAlert>
      <BlogTable
        data={tableData}
        columns={columns}
        sortOptions={{ path: "uploadedAt" }}
        searchByColumn="title"
        isItemSelected={isSelected}
        selectedItems={selectedItems}
        onDeleteAll={() => setShowDeleteAlert({ all: true, single: false })}
        getPaginatedItems={(p) => (p.length > 0 && !_.isEqual(p, paginated) ? setPaginated(p) : null)}
      />
    </div>
  );
};

export default PublishedBlogs;
