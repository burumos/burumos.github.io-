package main

import (
	"io"
	"fmt"
	"os"
	"errors"
	"encoding/json"
	"bufio"
	"strings"
	"path/filepath"
)

type Json map[string]map[string]string

func main() {
	var (
		jsonPath string
		jsonContent Json
		err error
	)

	fmt.Println("start")
	// dir, _ := os.Executable()

	jsonPath, err = getArgs()
	if (err != nil) {
		fmt.Println("引数でjson fileの指定して")
		return
	}
	fmt.Printf("%s\n", jsonPath)

	jsonContent, err = getJsonContent(jsonPath)
	fmt.Printf("%#v \n%#v\n", jsonContent, err)

	variables, _ := jsonContent["variables"]
	files, _ := jsonContent["files"]
	for from, to := range files {
		for key, val := range variables {
			if (strings.HasPrefix(from, key)) {
				files[strings.Replace(from, key, val, 1)] = to
				delete(files, from)
				break
			}
		}
	}
	copyFiles(files)
}

func getArgs() (string, error) {
	args := os.Args[1:]
	if len(args) < 1 {
		return "", errors.New("引数で指定がない")
	}
	return args[0], nil
}

func getJsonContent(jsonPath string) (Json, error){
	var j Json

	if fp, err := os.Open(jsonPath); err != nil {
		return j, errors.New("fileがない")
	} else if content, err := getFileContent(fp); err != nil  {
		return j, err
	} else if err := json.Unmarshal([]byte(content), &j); err != nil {
		return j, err
	} else {
		return j, nil
	}
}

func getFileContent(file *os.File) (string, error) {
	text := ""
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		text += scanner.Text() + "\n"
	}
	if err := scanner.Err(); err != nil {
		return text, errors.New("file scann error")
	}

	return text, nil
}

func copyFiles(files map[string]string) error {
	path, err := os.Executable()
	if (err != nil) {
		return errors.New("実行ファイルのファイルパスが取れなかった");
	}
	path = filepath.Dir(path) + "/../"

	fmt.Printf("path: %s\n", path)
	// path := "/Users/kawajiri_n/work/github-pages/"

	for from, to := range files {
		fmt.Printf("COPY: %s => %s\n", from, to)
		err := copy(from, path + to)
		if err != nil {
			fmt.Printf("copy error: %#v\n", err)
			break
		}
	}

	return nil
}

func copy(src, to string) error {
	_, err := os.Stat(src)
	if err != nil {
		fmt.Printf("src file error\n")
		return err
	}

	source, err := os.Open(src)
	if err != nil {
		fmt.Printf("can't open src file error\n")
		return err
	}
	defer source.Close()

	var destination *os.File
	if _, err := os.Stat(to); err == nil{
		// コピー先が存在すれば削除する
		os.Remove(to)
	}

	destination, err = os.Create(to)
	if (err != nil) {
		fmt.Printf("dist file error %s\n", to)
		return err
	}

	defer destination.Close()
	_, err = io.Copy(destination, source)
	if (err != nil) {
		fmt.Printf("copy execute error f:%#v t:%#v\n %s\n", destination, source)
	}
	return err
}
