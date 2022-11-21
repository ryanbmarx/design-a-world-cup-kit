#!/usr/bin/env sh

set -e

# staging or production?
BUCKET="dev"
while [ "$1" != "" ]; do
	case $1 in
		--staging )
			shift
			BUCKET="dev"
			;;

		--preprod )
			shift
			BUCKET="preprod"
			;;

		--production )
			shift
			BUCKET="master"
			;;

		* ) shift;;
	esac
done

echo "Deploying to $BUCKET ..."

CDN_AUTH=$(echo $CDN_AUTH | base64 --decode)
USAT_AUTH=$(echo $USAT_AUTH | base64 --decode)

CDN_SPACE="gs://usat-storytelling/storytelling-studio-apps/$BUCKET"
PUBLIC_PATH="https://www.gannett-cdn.com/usat-storytelling/storytelling-studio-apps/$BUCKET"
CDN_PATH="https://$CDN_AUTH@www.gannett-cdn.com/usat-storytelling/storytelling-studio-apps/$BUCKET"
DEV_DOMAIN="dev-uw.usatoday.com"

PROJECT_SLUG="$(basename $(pwd))"
PROJECT_FOLDER="./public"

PUBLIC_URL="$PUBLIC_PATH/$PROJECT_SLUG/index.html"

gsutil -m rsync -r $PROJECT_FOLDER "$CDN_SPACE/$PROJECT_SLUG"

for filename in $(cd $PROJECT_FOLDER && find *); do
	#echo "$CDN_PATH/$PROJECT_SLUG/$filename"
	curl -X PURGE "$CDN_PATH/$PROJECT_SLUG/$filename" &
done

curl -X PURGE "$CDN_PATH/$PROJECT_SLUG/index.html" -m 10 &

# Add AllUsers:R to the project folder
gsutil -m acl ch -u AllUsers:R  -r "$CDN_SPACE/$PROJECT_SLUG"


# Purge the prod URL
curl -X PURGE "https://$USAT_AUTH@www.usatoday.com/storytelling/world-cup-jersey-design-your-own/"
wait
echo "Deployed:"
echo $PUBLIC_URL
