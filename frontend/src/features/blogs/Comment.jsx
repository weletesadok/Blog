import formatDate from "../../helpers/formatDate.helper";
export default (comments) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
          Comments ({comments.comments.length})
        </h2>
      </div>
      {comments.comments.map((comment, index) => {
        return (
          <div
            key={index}
            className="p-2 text-base bg-white rounded-lg dark:bg-gray-900"
          >
            <footer className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                  <img
                    className="mr-2 w-6 h-6 rounded-full"
                    src={"null"}
                    alt={"commentorUserName"}
                  />
                  by Mamo
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <time>{formatDate(new Date())}</time>
                </p>
              </div>
            </footer>
            <p className="text-gray-500 dark:text-gray-400">
              {comment.comment}
            </p>
          </div>
        );
      })}
    </>
  );
};
