import json
import os


class Bookmarks(object):
    path = os.path.join(os.path.dirname(__file__), "bookmarks", "bookmarks.json")

    def __init__(self):
        self.create_file()

    def create_file(self):
        dirname = os.path.dirname(self.path)
        if not os.path.isdir(dirname):
            os.mkdir(dirname)
        if not os.path.isfile(self.path):
            with open(self.path, "w") as bookmarks_writer:
                bookmarks_writer.write(json.dumps([], indent=4))

    def get_data(self):
        self.create_file()
        with open(self.path, "r") as file_reader:
            return json.loads(file_reader.read())

    def bookmark(self, folder):
        data = self.get_data()
        add_bookmark = None
        if folder in data:
            data.remove(folder)
        else:
            data.append(folder)
            add_bookmark = True
        self.__write_json_data(data)
        return add_bookmark

    def __write_json_data(self, data):
        self.create_file()
        with open(self.path, "w") as file_writer:
            file_writer.write(json.dumps(data))
