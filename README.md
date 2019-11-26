# setup-unity
Set up your GitHub Actions workflow with a specific version of the Unity Editor

## Usage

### Pre-requisites
Create a workflow `.yml` file in your repositories `.github/workflows` directory. An [example workflow](#example-workflow) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs

* `unity-version` - Install Unity Editor version.

### Outputs

* `id` - An ID value to download that version of Unity.

### Example workflow

```yaml
name: Show alf

on: push

jobs:
  echo:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        unity-version: [2018.4.12f1, 2019.2.13f1, 2019.3.0b12, 2020.1.0a14]
    steps:
    - run: echo -n -e "HELLO\n !\n World!" > text.txt

    - uses: pCYSl5EDgo/setup-unity@master
      with:
        unity-version: ${{ matrix.unity-version }}

    - run: /opt/Unity/Editor/Unity -quit -batchMode -logFile -noGraphics -createManualActivationFile || exit 0
    - run: cat Unity_v${{ matrix.unity-version }}.alf
```

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)